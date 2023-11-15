import { Theme } from "@/lib/theme";
import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({className, children}: {className: string, children: string}) => {
     let lang = 'text'; // default monospaced text
     if (className && className.startsWith('lang-')) {
       lang = className.replace('lang-', '');
     }
     return (
       <SyntaxHighlighter language={lang} style={Theme() == 'light' ? oneLight : oneDark} customStyle={{
          backgroundColor: "transparent",
       }}>
         {children}
       </SyntaxHighlighter>
     );
   }
   

type PreBlockProps = {
     children: React.ReactNode,
     [key: string]: any,
   };
   
export const PreBlock: React.FC<PreBlockProps> = ({children, ...rest}) => {
     if (React.isValidElement(children) && children.type === 'code') {
       return CodeBlock(children.props);
     }
     return <pre {...rest}>{children}</pre>;
   };