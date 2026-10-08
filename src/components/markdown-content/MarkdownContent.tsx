import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useTranslation } from 'react-i18next';
import 'hds-core/lib/components/link/link.min.css';
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
  'data-testid'?: string;
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
  'data-testid': dataTestId,
}: MarkdownContentProps) => {
  const { t } = useTranslation('common');
  const defaultPlugins = [remarkGfm];

  const link: Components['a'] = ({
    href,
    children: myChildren,
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const openInNewTab = linkTarget === '_blank';
    return (
      <a
        href={href ?? '#'}
        className={classNames(
          'hds-link',
          openInNewTab && [
            'hds-icon--link-external',
            'hds-icon-end--link-external',
          ],
        )}
        target={linkTarget}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        data-testid={dataTestId && `${dataTestId}-link`}
      >
        {myChildren}
        {openInNewTab && (
          <span className={styles.visuallyHidden}>
            {` (${t('linkOpensInNewTab', { defaultValue: 'avautuu uudessa välilehdessä' })})`}
          </span>
        )}
      </a>
    );
  };

  return (
    <div
      className={classNames(styles.markdownContent, className)}
      data-testid={dataTestId}
    >
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
