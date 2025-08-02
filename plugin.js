CKEDITOR.plugins.add('imagetool', {
    icons: 'imagetool',
    init: function (editor) {
        editor.addCommand('openImageTool', new CKEDITOR.dialogCommand('imageToolDialog'));
        editor.ui.addButton('ImageTool', {
            label: 'Image Reducer Tool',
            command: 'openImageTool',
            toolbar: 'insert',
            icon: this.path + 'icon.png'
        });

        CKEDITOR.dialog.add('imageToolDialog', this.path + 'dialog.js');
    }
});
