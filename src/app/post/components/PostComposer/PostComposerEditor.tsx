import { RichText } from "@atproto/api";
import { AutoLinkNode } from "@lexical/link";
import {
  AutoLinkPlugin,
  LinkMatcher,
} from "@lexical/react/LexicalAutoLinkPlugin";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import clsx from "clsx";
import { $getRoot } from "lexical";

import { MentionNode } from "@/src/app/post/components/PostComposer/LexicalMentionNode";
import MentionsPlugin from "@/src/app/post/components/PostComposer/LexicalMentionPlugin";

import styles from "./PostComposerEditor.module.scss";

type Props = {
  editableProps: Omit<React.AllHTMLAttributes<HTMLDivElement>, "className">;
  classNames: {
    container?: string;
    editable?: string;
    placeholder?: string;
  };
};

const handleError: InitialConfigType["onError"] = (error) => {
  console.error(error);
};

const initialConfig: InitialConfigType = {
  namespace: "FlatPostComposer",
  onError: handleError,
  nodes: [AutoLinkNode, MentionNode],
};

export function PostComposerEditor({ editableProps, classNames }: Props) {
  const linkMatcher: LinkMatcher = (text) => {
    const rt = new RichText({ text });
    rt.detectFacetsWithoutResolution();
    const seg = Array.from(rt.segments())
      .filter((seg) => seg.isLink() || seg.isMention())
      .at(0);
    if (!seg || !seg.facet) return null;

    return {
      index: seg.facet.index.byteStart,
      length: seg.facet.index.byteEnd - seg.facet.index.byteStart,
      text: seg.text,
      url: "",
    };
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={clsx(styles.container, classNames.container)}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              {...editableProps}
              className={clsx("editor-input", classNames.editable)}
            />
          }
          placeholder={
            <div className="editor-placeholder">Enter some text...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              // Read the contents of the EditorState here.
              const root = $getRoot().getTextContent();

              console.log(root);
            });
          }}
        />
        <AutoLinkPlugin matchers={[linkMatcher]} />
        <MentionsPlugin />
      </div>
    </LexicalComposer>
  );
}
