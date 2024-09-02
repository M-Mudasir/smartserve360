const { SqlDatabase } = require("langchain/sql_db");
const { DataSource } = require("typeorm");
const { ChatOpenAI } = require("@langchain/openai");
const { createSqlQueryChain } = require("langchain/chains/sql_db");
// const { QuerySqlTool } = require("langchain/tools/sql");
// const { PromptTemplate } = require("@langchain/core/prompts");
// const { StringOutputParser } = require("@langchain/core/output_parsers");
// const { RunnablePassthrough, RunnableSequence, } = require("@langchain/core/runnables");


require("dotenv").config();
const env = process.env.NODE_ENV || "development";
let config = require(__dirname + "/../config/config.js")[env];

async function generateSqlAgentTableResponse(query) {
    const datasource = new DataSource({
        type: "mysql",
        username: config.username,
        password: config.password,
        host: config.host,
        port: config.port,
        database: config.database,
    });
    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });

    const llm = new ChatOpenAI({ temperature: 0 });

    const chain = await createSqlQueryChain({
        llm,
        db,
        dialect: "sqlite",
    });

    const response = await chain.invoke({
        question: `If user wants to list all records, don't limit the query and Generate the query with * to get all records . 
        In case of orders and deals, do not include menuItems column.
        In case of users do not include Password and verification code column. 
        In case of menu_items table do not include ingredient column. 
        Do NOT enclose tables in quotes e.g. "menu_items", "deals".
        Here's the user query ${query}`});

    return response

}


module.exports = generateSqlAgentTableResponse;