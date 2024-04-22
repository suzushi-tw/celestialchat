"use client"
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Github
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Chat from "./Chat"
import { useState, useEffect } from "react"
import { ScrollArea } from "./ui/scroll-area"
import Image from "next/image"
import { Button } from "./ui/button"

interface LinkItem {
  title: string;
  url: string;
}


const Landing = () => {

  const [relatedLinks, setRelatedLinks] = useState('');
  const [parsedLinks, setParsedLinks] = useState<LinkItem[]>([]); // Updated useState
  const handleRelatedLinks = (links: string) => {
    console.log(links)
    setRelatedLinks(links);

  };

  // useEffect(() => {
  //   if (relatedLinks) {
  //     // Parse the links and update the state
  //     const linksArray = relatedLinks.split('\n');
  //     let parsed = [];
  //     let currentTitle = '';
  //     let currentLink = '';

  //     linksArray.forEach(item => {
  //       if (item.startsWith('Link:')) {
  //         // If there's a current title without a link, update its link
  //         if (currentTitle && !currentLink) {
  //           currentLink = item.replace('Link: ', '');
  //           parsed.push({ title: currentTitle, url: currentLink });
  //           currentTitle = ''; // Reset currentTitle for the next title
  //         } else {
  //           // If there's no current title, this is likely an error in the input
  //           console.error('Unexpected link without a preceding title:', item);
  //         }
  //       } else if (item !== '') {
  //         // If there's a title without a link, set it as the current title
  //         if (currentTitle && !currentLink) {
  //           // This is likely an error in the input, as we have a title without a link
  //           console.error('Unexpected title without a link:', item);
  //         } else {
  //           currentTitle = item;
  //         }
  //       }
  //     });

  //     // If there's a pending title without a link at the end, add it with an empty link
  //     if (currentTitle && !currentLink) {
  //       parsed.push({ title: currentTitle, url: '' });
  //     }

  //     setParsedLinks(parsed);
  //   }
  // }, [relatedLinks]); // Dependency array to watch for changes in relatedLinks


  useEffect(() => {
    if (relatedLinks) {
      // Parse the links and update the state
      const linksArray = relatedLinks.split('\n');
      let parsed: LinkItem[] = [];
      let currentTitle = '';
      let currentUrl = '';

      linksArray.forEach((item, index) => {
        if (index % 2 === 0) {
          // This is a title
          currentTitle = item;
        } else {
          // This is a url
          currentUrl = item.replace('Link: ', '');
          parsed.push({ title: currentTitle, url: currentUrl });
          currentTitle = '';
          currentUrl = '';
        }
      });

      setParsedLinks(parsed);
      console.log(parsed)
    }
  }, [relatedLinks]);




  return (
    <>
      <div className="grid min-h-[calc(100vh-3.5rem)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 ">

            <div className="flex-1 mt-8">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Tired of waiting for answers?
                </Link>
                <ScrollArea className="h-[calc(100vh-3.5rem-20rem)]">

                  {parsedLinks.length > 0 ? (
                    parsedLinks.map((link, index) => (
                      link && (
                        <Link href={link.url} key={index}>
                          <Card className="w-[250px] ">
                            <CardHeader>
                              <CardTitle className="truncate w-full text-lg">{link.title}</CardTitle>
                              <CardDescription className="truncate w-full">{link.url}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      )
                    ))
                  ) : (
                    <div className="items-center justify-center flex flex-col">
                      <Image src="/cta.png" alt="Call to action" height={200} width={200} />
                      <h1>Get your answer in seconds, not days !</h1>
                    </div>
                  )}

                </ScrollArea>

              </nav>
            </div>
            <div className="mt-auto p-4">
              <Card x-chunk="dashboard-02-chunk-0">
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Deploy your own blazing fast AI chat</CardTitle>
                  <CardDescription>
                    Head over to Github to find out more details !
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Link href={"https://github.com/suzushi-tw/celestialchat"} className="w-full inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Self Host
                  </Link>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col">

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Chat</h1>
            </div>

            <div className="w-full h-full">
              <Chat onRelatedLinks={handleRelatedLinks} />
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Landing;