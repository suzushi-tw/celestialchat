"use client"
import React, { use } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import Chatinput from './Chatinput'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
import { Select, SelectTrigger, SelectItem, SelectLabel, SelectGroup, SelectValue, SelectContent } from './ui/select'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { Send } from 'lucide-react'
import { useChat } from 'ai/react';
import toast, { Toaster } from 'react-hot-toast';
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useState, useRef, useEffect } from 'react';
import CopyToClipboard from './CopyToClipboard'
import { Markdown, MarkdownProps, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Input } from './ui/input'
import { Cleansvg } from '@/lib/icon'

interface ChatProps {
    onRelatedLinks: (links: string) => void;
}

function Chat({ onRelatedLinks }: ChatProps) {
    const [relatedLinks, setRelatedLinks] = useState('');
    const [depth, setdepth]=useState(false)
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [previousmessage, setpreviosmessage] = useState('');
    const [model, setModel] = useState('claude-3-haiku-20240307'); // default value
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } =
        useChat({
            body: {
                previousmessage: JSON.stringify(previousmessage),
                aimodel: model,
                depth: depth
            },
            onResponse: response => {
                console.log(messages);
                console.log(response)
                if (!response.ok) {
                    toast.error(error?.message || 'Something went wrong!')
                } else {
                    const headers = response.headers;
                    const relatedLink = headers.get("X-Related-Link");
                    if (relatedLink) {
                        const decodedlink = `\n${decodeURIComponent(relatedLink)}`;
                        console.log("Related Link:", decodedlink);
                        setRelatedLinks(decodedlink);

                    }

                }

            },
            onFinish: () => {
                setIsMessageComplete(true);
            }
        })

    useEffect(() => {
        if (isMessageComplete && messages.length > 0) {
            // Assuming you have a way to determine the last AI message
            // For example, by checking the role or content of the last message
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                // Append related links to the last AI message
                // This is a simplified example; adjust according to your data structure
                const lastThreeMessages = messages.slice(-4);
                const previousmessage = lastThreeMessages.map(message => {
                    return message.role === 'user' ? `User: ${message.content}` : `Assistant: ${message.content}`;
                }).join('\n');
                setpreviosmessage(previousmessage);
                console.log(previousmessage)
                lastMessage.content += `\n\nRelated Links: ${relatedLinks}`;
                // Reset the flag
                setIsMessageComplete(false);

            }
        }
    }, [messages, isMessageComplete, relatedLinks]);

    const clearchat = () => {
        setMessages([])
    }
    const toggledepth=()=>{
        setdepth(!depth)
    }


    const handleValueChange = async (selectedValue: string) => {
        console.log("Selected value: ", selectedValue);
        toast.success("AI model Updated !")
        setModel(selectedValue);
    };


    return (
        <div className='w-full h-full'>
            <Card className='w-full h-full flex flex-col justify-end' >
                {/* <CardHeader>
                    <CardTitle>Chat</CardTitle>
                </CardHeader> */}
                <CardContent >
                    {messages.length === 0 || (messages.length === 1 && messages[0].role === 'system') ? (
                        <div className='my-12 text-5xl font-medium p-5'>
                            <p>
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    Hello,
                                </span>
                            </p>
                            <p>How can I help you today?</p>
                        </div>

                    ) : (
                        <ScrollArea
                            className='mb-2 h-[calc(100vh-3.5rem-16rem)] rounded-md p-2'

                        >



                            {messages.map((m) => (

                                <div key={m.id} className='mr-6 whitespace-pre-wrap md:mr-12' >
                                    {m.role === 'user' && (
                                        <div className='mb-6 flex gap-3'>
                                            <Avatar>
                                                <AvatarImage src='' />
                                                <AvatarFallback className='text-sm'>U</AvatarFallback>
                                            </Avatar>
                                            <div className='mt-1.5'>
                                                <p className='font-semibold'>You</p>
                                                <div className='mt-1.5 text-sm text-zinc-700'>
                                                    {m.content}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {m.role === 'assistant' && (
                                        <div className='mb-6 flex gap-3'>
                                            <Avatar>
                                                <AvatarImage src='' />
                                                <AvatarFallback className='bg-blue-500 text-white'>
                                                    AI
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='mt-1.5 w-full'>
                                                <div className='flex '>
                                                    <p className='font-semibold'>Bot</p>
                                                    <CopyToClipboard message={m} className='-mt-1 ml-2' />
                                                </div>
                                                <div className='mt-2 text-black'>

                                                    {/* <Markdown className='my-3 text-sm' lineHeight={1.0} variant="chat" fontSize={16}>
                                                        {`${m.content} ${relatedLinks && `\n \n Related Links: ${relatedLinks}`}`}
                                                    </Markdown> */}
                                                    <Markdown className='my-3 text-sm' lineHeight={1.0} variant="chat" fontSize={16}>
                                                        {m.content}
                                                    </Markdown>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}



                        </ScrollArea>


                    )}

                </CardContent>
                <CardFooter className='w-full flex flex-col'>
                    <form className='w-full' onSubmit={handleSubmit} onReset={clearchat}>
                        <Input
                            className="p-4"
                            placeholder={`Ask any question`}
                            value={input} // Use `input` from `useChat`
                            onChange={handleInputChange} // Use `handleInputChange` from `useChat`
                        />
                        <div className='flex flex-row justify-between w-full mt-2'>
                            <div className="flex items-center gap-1.5 ">
                                <Button type="reset">
                                    <Cleansvg />
                                </Button>
                                <Select onValueChange={handleValueChange}>
                                    <SelectTrigger className="w-[180px] focus-visible:ring-transparent">
                                        <SelectValue placeholder="Claude Haiku" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Models</SelectLabel>
                                            <SelectItem value="gpt-3.5-turbo-16k" >GPT 3.5</SelectItem>
                                            <SelectItem value="claude-3-haiku-20240307">Claude Haiku</SelectItem>
                                            <SelectItem value="gpt-4-turbo-2024-04-09" >GPT 4 Turbo ⚡️</SelectItem>
                                            <SelectItem value="claude-3-sonnet-20240229" >Claude Sonnet ⚡️</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Switch id="depth" onClick={toggledepth}/>
                                <Label >Depth</Label>
                            </div>
                            <Button
                                className='ml-2 bg-black '
                                aria-label='send message'
                                type='submit'
                            >
                                <Send className='h-4 w-4' />
                            </Button>
                        </div>
                    </form>


                </CardFooter>
            </Card>
        </div >
    )
}

export default Chat
