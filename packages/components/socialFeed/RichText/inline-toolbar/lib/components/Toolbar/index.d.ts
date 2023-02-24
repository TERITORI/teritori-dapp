import { ComponentType, FC } from 'react';
import { EditorState } from 'draft-js';
import { DraftJsButtonTheme } from '@draft-js-plugins/buttons';
import { InlineToolbarPluginStore } from '../..';
import { InlineToolbarPluginTheme } from '../../theme';
export interface ToolbarChildrenProps {
    theme: DraftJsButtonTheme;
    getEditorState: () => EditorState;
    setEditorState: (editorState: EditorState) => void;
    onOverrideContent: (content: ComponentType<ToolbarChildrenProps> | undefined) => void;
}
interface ToolbarProps {
    store: InlineToolbarPluginStore;
    children?: FC<ToolbarChildrenProps>;
    isVisible?: boolean;
    position?: {
        top: number;
        left: number;
    };
    overrideContent?: ComponentType<ToolbarChildrenProps>;
    theme: InlineToolbarPluginTheme;
}
export declare const Toolbar: FC<ToolbarProps>;
export default Toolbar;
