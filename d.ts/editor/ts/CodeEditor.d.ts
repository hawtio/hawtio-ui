/// <reference path="../../includes.d.ts" />
/**
 * Module that contains several helper functions related to hawtio's code editor
 *
 * @module CodeEditor
 * @main CodeEditor
 */
declare module CodeEditor {
    /**
     * Options for the CodeMirror text editor
     *
     * @class CodeMirrorOptions
     */
    interface CodeMirrorOptions {
        /**
         * @property theme
         * @type String
         */
        theme: string;
        /**
         * @property tabSize
         * @type number
         */
        tabSize: number;
        /**
         * @property lineNumbers
         * @type boolean
         */
        lineNumbers: boolean;
        /**
         * @property indentWithTabs
         * @type boolean
         */
        indentWithTabs: boolean;
        /**
         * @property lineWrapping
         * @type boolean
         */
        lineWrapping: boolean;
        /**
         * @property autoClosetags
         * @type boolean
         */
        autoClosetags: boolean;
    }
    /**
     * @property GlobalCodeMirrorOptions
     * @for CodeEditor
     * @type CodeMirrorOptions
     */
    var GlobalCodeMirrorOptions: {
        theme: string;
        tabSize: number;
        lineNumbers: boolean;
        indentWithTabs: boolean;
        lineWrapping: boolean;
        autoCloseTags: boolean;
    };
    /**
     * Tries to figure out what kind of text we're going to render in the editor, either
     * text, javascript or XML.
     *
     * @method detectTextFormat
     * @for CodeEditor
     * @static
     * @param value
     * @returns {string}
     */
    function detectTextFormat(value: any): string;
    /**
     * Auto formats the CodeMirror editor content to pretty print
     *
     * @method autoFormatEditor
     * @for CodeEditor
     * @static
     * @param {CodeMirrorEditor} editor
     * @return {void}
     */
    function autoFormatEditor(editor: CodeMirrorEditor): void;
    /**
     * Used to configures the default editor settings (per Editor Instance)
     *
     * @method createEditorSettings
     * @for CodeEditor
     * @static
     * @param {Object} options
     * @return {Object}
     */
    function createEditorSettings(options?: any): any;
}
