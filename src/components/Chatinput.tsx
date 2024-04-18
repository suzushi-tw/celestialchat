import React from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectTrigger, SelectItem, SelectLabel, SelectGroup, SelectValue, SelectContent } from './ui/select'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { Send } from 'lucide-react'

function Chatinput() {
    return (
        <div>
            <div className="w-full">

                <Textarea
                    rows={1}

                    placeholder='Enter your question...'
                    className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch focus-visible:ring-transparent'
                />
                <div className="flex items-center">

                   
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button

                                    // className={cn(
                                    //   buttonVariants({ size: 'sm', variant: 'outline' }),
                                    //   'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
                                    // )}
                                    className='mx-2'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                                        <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
                                    </svg>
                                    <span className="sr-only">New Chat</span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>New Chat</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1.5 ">
                        <Select>
                            <SelectTrigger className="w-[180px] focus-visible:ring-transparent">
                                <SelectValue placeholder="Claude Haiku" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Models</SelectLabel>
                                    <SelectItem value="gpt-3.5-turbo-16k" disabled>GPT 3.5</SelectItem>
                                    <SelectItem value="claude-3-haiku-20240307">Claude Haiku</SelectItem>
                                    <SelectItem value="gpt-4-1106-preview" disabled>GPT 4 Turbo ⚡️</SelectItem>
                                    <SelectItem value="claude-3-sonnet-20240229" disabled>Claude Sonnet ⚡️</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    <Button

                        className='absolute  right-[12px] bg-black '
                        aria-label='send message'
                    >
                        <Send className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Chatinput
