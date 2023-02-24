import { DraftJsButtonTheme } from '@draft-js-plugins/buttons';
export interface InlineToolbarPluginTheme {
    buttonStyles: DraftJsButtonTheme;
    toolbarStyles: {
        toolbar?: string;
    };
}
export declare const defaultTheme: InlineToolbarPluginTheme;
