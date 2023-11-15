import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Theme } from "@/lib/theme";
import { Check, Copy } from "lucide-react";
import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ className, children }: { className: string, children: string }) => {
  const [copied, setCopied] = React.useState(false);
  const code = children.trim();
  let lang = 'text'; // default monospaced text
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '');
  }
  return (
    <div className="flex justify-between bg-popover border rounded-sm">
      <SyntaxHighlighter language={lang} style={Theme() == 'light' ? oneLight : oneDark} customStyle={{
        backgroundColor: "transparent",
      }}>
        {children}
      </SyntaxHighlighter>
      <div className="clipboard-button p-2 h-12">
        <Button variant={'ghost'} size={'icon'} className="h-8 w-8 rounded-sm" onClick={
          () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }
        }>
          {
            copied ? (
              <TooltipProvider>
                <Tooltip open>
                  <TooltipTrigger>
                    <Check className="h-4 w-4" stroke="#16a34a" />
                    <span className="sr-only">Copied!</span>
                  </TooltipTrigger>
                  <TooltipContent align="end">
                    Copied!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                <Copy className="h-4 w-4" strokeWidth={1.75} />
                <span className="sr-only">Copy</span>
              </>
            )
          }
        </Button>
      </div>
    </div>
  );
}


type PreBlockProps = {
  children: React.ReactNode,
  [key: string]: any,
};

export const PreBlock: React.FC<PreBlockProps> = ({ children, ...rest }) => {
  if (React.isValidElement(children) && children.type === 'code') {
    return CodeBlock(children.props);
  }
  return <pre {...rest}>{children}</pre>;
};

