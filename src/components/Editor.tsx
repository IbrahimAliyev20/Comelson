'use client';

import dynamic from 'next/dynamic';
import 'ckeditor5/ckeditor5.css';

type Props = {
  value: string;
  onChange: (data: string) => void;
};

const CKEditorClient = dynamic(
  async () => {
    const [{ CKEditor }, ckeditor5] = await Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('ckeditor5'),
    ]);

    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Link,
      List,
      BlockQuote,
      Heading,
      Alignment,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageResize,
      Table,
      TableToolbar,
      Code,
      CodeBlock,
      Autoformat,
    } = ckeditor5;

    function CKEditorWrapper({ value, onChange }: Props) {
      return (
        <div className="comelson-ckeditor">
          <CKEditor
            editor={ClassicEditor}
            data={value}
          config={{
            licenseKey: 'GPL',
            plugins: [
              Essentials,
              Paragraph,
              Heading,
              Bold,
              Italic,
              Underline,
              Link,
              List,
              BlockQuote,
              Alignment,
              Code,
              CodeBlock,
              Autoformat,
              Image,
              ImageToolbar,
              ImageCaption,
              ImageStyle,
              ImageResize,
              Table,
              TableToolbar,
            ],
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'link',
              'code',
              'blockQuote',
              '|',
              'alignment',
              'bulletedList',
              'numberedList',
              '|',
              'insertTable',
              'codeBlock',
              '|',
              'undo',
              'redo',
            ],
            image: {
              toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
              ],
            },
            table: {
              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
            },
          }}
            onChange={(_, editor) => onChange(editor.getData())}
          />
        </div>
      );
    }

    return CKEditorWrapper;
  },
  { ssr: false }
);

export default function Editor({ value, onChange }: Props) {
  return <CKEditorClient value={value} onChange={onChange} />;
}
