import React, {useState} from 'react';

// react-pintura
import {PinturaEditor} from '@pqina/react-pintura';

// pintura
import '@pqina/pintura/pintura.css';
import {getEditorDefaults} from '@pqina/pintura';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";


// get default properties
const editorDefaults = getEditorDefaults({
    stickers: [''],
    utils: ['sticker', 'finetune', 'filter', 'annotate', 'resize'],
});

// console.log("Editor Defaults",editorDefaults);
export default function Example() {
    const [result, setResult] = useState('');
    const [template, setTemplate] = useState('');
    const templates = [
        { name: 'Square, white background, 5% padding', image: 'template/door.jpg', templateId: '9124f52a-3512-48b7-80f1-2cb07a3607fb'},
        { name: 'Square, black background, 5% ', image: 'template/cake.jpg', templateId: '267f6020-2814-4c4f-83c5-9908e8f60d63'},
        { name: 'Square, black background, % padding', image: 'template/cm.jpg', templateId: '267f6020-2814-4c4f-83c5-9908e8f60d65'},
    ];
    const handleChangeTemplate = (templateId) => {
        setTemplate(templateId)
    }
    console.log(template);

    return (
        <div>
            <h2>MMS R&D ON Template Editor</h2>
            <Container>
                <div className='image-container'>
                    {templates.map((item) =>
                        <div key={item.templateId}>
                            <Image height={100}  width={100} src={item.image} rounded onClick={(event) => handleChangeTemplate(item.image)} />
                        </div>
                    )}
                </div>
            </Container>

                <div style={{ height: '70vh' }}>
                    <PinturaEditor
                        {...editorDefaults}
                        src={ template}
                        imageCropAspectRatio={1}
                        onLoad={(res) => console.log('load image', res)}
                        onProcess={({ dest }) => setResult(URL.createObjectURL(dest))}
                        locale={{ stickerLabel: 'Upload' }}
                    />
                </div>

                {!!result.length && (
                    <div style={{width:'60vw'}}>
                        <img src={result} alt="" />
                    </div>
                )}

        </div>
    );
}
