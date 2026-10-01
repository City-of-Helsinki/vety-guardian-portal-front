import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Link } from 'hds-react';
import styles from './MarkdownContent.module.css';

type LinkTarget = '_blank' | '_self';

type PluggableList = import('unified').PluggableList;

export type MarkdownContentProps = {
  children: string;
  allowedElements?: string[];
  linkTarget?: LinkTarget;
  className?: string;
  plugins?: PluggableList;
  rehypePlugins?: PluggableList;
};

export const defaultAllowedElements = [
  'br',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'ol',
  'ul',
  'li',
  'p',
  '**',
  'strong',
  'table',
  'th',
  'tr',
  'td',
  'tbody',
  'thead',
];

export const MarkdownContent = ({
  children,
  allowedElements = defaultAllowedElements,
  linkTarget = '_blank',
  className,
  plugins = [],
  rehypePlugins = [],
}: MarkdownContentProps) => {
  const defaultPlugins = [remarkGfm];

  const link: Components['a'] = ({
    href,
    children: myChildren,
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={href ?? '#'}
      external={linkTarget === '_blank'}
      color="black"
      target={linkTarget}
    >
      {myChildren}
    </Link>
  );

  return (
    <div className={classNames(styles.markdownContent, className)}>
      <ReactMarkdown
        remarkPlugins={[...defaultPlugins, ...plugins]}
        rehypePlugins={rehypePlugins}
        allowedElements={allowedElements}
        unwrapDisallowed
        components={{ a: link }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
