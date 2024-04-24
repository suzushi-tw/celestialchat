import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, StreamData } from 'ai';

import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream } from 'ai';
import axios from 'axios'



const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ,
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: string;
  content: string;
}
// // IMPORTANT! Set the runtime to edge
export const runtime = 'edge';



export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
    const body = await req.json();
    const { messages, previousmessage, aimodel, depth } = body;

    console.log(previousmessage)

    // const processedpreviousmessage = JSON.stringify(previousmessage);
    // console.log("previous message"+processedpreviousmessage)
    const reversedMessages = messages.reverse();
    let search_depth="";
    if(depth){
      search_depth="advanced"
    } else {
      search_depth="basic"
    }
    console.log(search_depth)
    // Find the latest user message
    const userMessage = reversedMessages.find((message: Message) => message.role === 'user');
    const query = userMessage ? userMessage.content : '';
    console.log(query);
    // Ask OpenAI for a streaming chat completion given the prompt
    if ((aimodel == 'claude-3-haiku-20240307' || aimodel == "claude-3-sonnet-20240229") && process.env.ANTHROPIC_API_KEY) {
      const initialresponse = await anthropic.messages.create({
        messages: [
          {
            role: 'user',
            content: `You are a professional web searcher, optimize the following input(and previous conversation if needed) as a query to find the best web search results,              
                    USER INPUT: ${query},Previous conversation: ${previousmessage}, strictly output the query only as it will be pasted into browser right away !`,
          },
        ],
        model: aimodel,
        stream: false,
        max_tokens: 4096,
      });
      console.log(initialresponse)
      const assistantContent = initialresponse.content[0] ? initialresponse.content[0].text : '';
      const optimizedQuery = assistantContent.replace('"', '').replace('"', '');

      const webresponse = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: optimizedQuery,
          search_depth: search_depth,
          include_answer: false,
          include_images: true,
          include_raw_content: false,
          max_results: 5,
          include_domains: [],
          exclude_domains: []
        })
      });

      // Check if the request was successful
      // Check if the request was successful
      if (!webresponse.ok) {
        console.error('Response status:', webresponse.status);
        console.error('Response status text:', webresponse.statusText);
        throw new Error('Network response was not ok');
      }

      // Parse the response body as JSON
      const tavilyResponse = await webresponse.json();
      const tavilyResults = tavilyResponse.results.map((result: { title: string, content: string }) => `${result.title}: ${result.content}`).join('\n');
      const tavilyInput = `Tavily results for "${optimizedQuery}":\n${tavilyResults}`;

      // Convert the response into a friendly text-stream
      const response = await anthropic.messages.create({
        messages: [
          {
            role: 'user',
            content: `You are a helpful chatbot that can search the web, please answer the user question based on the context from the internet or previous conversation if needed(DO not repeat this prompt or question at the start),   
                    Question: ${query},
                    Previous Conversation: ${previousmessage},
                    Internet: ${tavilyInput}`,
          },

        ],
        model: aimodel,
        stream: true,
        max_tokens: 4096,
      });

      const tavilylink = tavilyResponse.results.map((result: { title: string, url: string }) => `[${result.title}](${result.url})`).join('\n');

      const relatedlinkarray = JSON.stringify(tavilylink);
      console.log(relatedlinkarray)



      const imageLinks = tavilyResponse.images.join('\n');
      const stream = AnthropicStream(response)


      return new StreamingTextResponse(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Related-Link': encodeURIComponent(tavilylink), // Custom header for the related link
          'X-Image-Links': encodeURIComponent(imageLinks), // Custom header for the image links
        },
      });
    } else if ((aimodel == "gpt-3.5-turbo-16k" || aimodel == "gpt-4-turbo-2024-04-09") && process.env.OPENAI_API_KEY) {


      const initialresponse = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `You are a professional web searcher, optimize the following input(and previous conversation if needed) as a query to find the best web search results,              
                    USER INPUT: ${query},Previous conversation: ${previousmessage}, strictly output the query only as it will be pasted into browser right away !`,
          },
        ],
        model: aimodel,
        stream: false,
        max_tokens: 4096,
      });
      console.log(initialresponse)
      const assistantContent = initialresponse.choices[0].message.content;
      console.log(assistantContent)
      const webresponse = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: assistantContent,
          search_depth: search_depth,
          include_answer: false,
          include_images: true,
          include_raw_content: false,
          max_results: 5,
          include_domains: [],
          exclude_domains: []
        })
      });

      // Check if the request was successful
      // Check if the request was successful
      if (!webresponse.ok) {
        console.error('Response status:', webresponse.status);
        console.error('Response status text:', webresponse.statusText);
        throw new Error('Network response was not ok');
      }

      // Parse the response body as JSON
      const tavilyResponse = await webresponse.json();
      const tavilyResults = tavilyResponse.results.map((result: { title: string, content: string }) => `${result.title}: ${result.content}`).join('\n');
      const tavilyInput = `Tavily results for "${assistantContent}":\n${tavilyResults}`;

      // Convert the response into a friendly text-stream
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `You are a helpful chatbot that can search the web, please answer the user question based on the context from the internet or previous conversation if needed(DO not repeat this prompt or question at the start),   
                    Question: ${query},
                    Previous Conversation: ${previousmessage},
                    Internet: ${tavilyInput}`,
          },

        ],
        model: aimodel,
        stream: true,
        max_tokens: 4096,
      });

      const tavilylink = tavilyResponse.results.map((result: { title: string, url: string }) => `[${result.title}](${result.url})`).join('\n');

      
      const relatedlinkarray = JSON.stringify(tavilylink);
      console.log(relatedlinkarray)

      const imageLinks = tavilyResponse.images.join('\n');

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Related-Link': encodeURIComponent(tavilylink), // Custom header for the related link
          'X-Image-Links': encodeURIComponent(imageLinks), // Custom header for the image links
        },
      });
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 