const logger = require('./logger/index');
const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'productdynamo';

const productPath = '/product/{id}';
const productsPath = '/products';

exports.handler = async function(event) {
  console.log(event);
 
  let response;
  switch(true) {
    
    case event.httpMethod === 'GET' && event.resource === productPath:
      response = await getProduct(event.pathParameters.id);
      break;
    case event.httpMethod === 'GET' && event.resource === productsPath:
      response = await getProducts();
      break;
    case event.httpMethod === 'POST' :
      response = await saveProduct(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.resource === productPath:
     const requestBody = JSON.parse(event .body);
     console.log(requestBody);
     console.log(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
      response = await modifyProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.resource === productPath:
      response = await deleteProduct(event.pathParameters.id);
      break;
    default:
      response = buildResponse(404, '404 error');
  }
  return response;
}

async  function getProduct(id) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': id
    }
  }
      return await dynamodb.get(params).promise().then((response) => {
    
      //console.debug("The response from database" +JSON.stringify(response));
      if(response.Item===undefined){
      logger.debug("The response from database is  " + JSON.stringify(response));
      logger.error("There is no product associated with the given Id");
      logger.debug("the data in database is " + response.Item);
      return buildResponse(200, response.Item);
      }
      else{
    
      logger.info("The information is fetched from database");
      logger.info(JSON.stringify(response.Item));
    return buildResponse(200, response.Item);
      }
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  });
}

async function getProducts() {
  const params = {
    TableName: dynamodbTableName
  }
  
  const dynamoData = await dynamodb.scan(params).promise();
  var obj = JSON.parse(JSON.stringify(dynamoData));
  var count = obj.Count;
  
  

 
  if(count===0){
    logger.error("there is no data in database");
    logger.debug("The data from database is " +JSON.stringify( dynamoData));
    return buildResponse(200,dynamoData);
  }
  else{
    logger.info("The data fetched successfully from database " + JSON.stringify(dynamoData));
    
  
    return buildResponse(200,dynamoData);
} 
}


async function saveProduct(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  console.log("this is params"+ params);

  
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    console.log("this is the"+JSON.stringify(requestBody));
    logger.info("The information is posted in database");
    return buildResponse(200, body);
  }, (error) => {
    console.error("this is the error"+ error);
  })
}

async function modifyProduct(productId, updateKey, updateValue) {
  console.log(productId, updateKey, updateValue);
 
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': productId
    },
    UpdateExpression: `set name = :value`,
    
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    logger.info("The information is updated in database");
   
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

async function deleteProduct(id) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': id
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    logger.info("The data is deleted from database");
    return buildResponse(200, body);
  }, (error) => {
    console.error("this is the error"+error);
  })
}

function buildResponse(statusCode, body) {
  
  return {
    statusCode:statusCode,
  
    body: JSON.stringify(body)
  }
}