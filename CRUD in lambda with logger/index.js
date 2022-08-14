const logger = require('./logger/index');
const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'product-inventory';

const productPath = '/product';
const productsPath = '/products';

exports.handler = async function(event) {
 
  let response;
  switch(true) {
    
    case event.httpMethod === 'GET' && event.path === productPath:
      response = await getProduct(event.queryStringParameters.productId);
      break;
    case event.httpMethod === 'GET' && event.path === productsPath:
      response = await getProducts();
      break;
    case event.httpMethod === 'POST' && event.path === productPath:
      response = await saveProduct(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.path === productPath:
     const requestBody = JSON.parse(event .body);
     console.log(requestBody);
     console.log(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
      response = await modifyProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.path === productPath:
      response = await deleteProduct(event.queryStringParameters.productId);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async  function getProduct(productId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': productId
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
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
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

async function deleteProduct(productId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': productId
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