import React, {useState} from 'react';

// react-pintura
import {PinturaEditor} from '@pqina/react-pintura';

// pintura
import '@pqina/pintura/pintura.css';
import {getEditorDefaults} from '@pqina/pintura';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
const CLIP_API_REMOVE_BG = `https://sdk.photoroom.com/v1/segment`
const CLIP_API_REPLACE_BG = `https://beta-sdk.photoroom.com/v1/render`
const API_KEY = "27e9428e688f503335e699d229836d83e62f0e13"

// get default properties
const editorDefaults = getEditorDefaults({
  // utils: ['sticker', 'finetune', 'filter', 'annotate', 'resize'],
  utils: ['sticker', 'annotate', 'crop', 'filter', 'resize'],
  util: 'sticker'
  // utils: ['annotate', 'finetune', 'filter', 'sticker', 'resize'],
});

// console.log("Editor Defaults",editorDefaults);
export default function Example() {
  const [loading, setLoading] = useState();

  const [file, setFile] = useState('');
  const [uploadFile, setUploadFile] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Olive_wreath.svg/1259px-Olive_wreath.svg.png');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const makeImage =  URL.createObjectURL(e.target.files[0])
      setUploadFile(makeImage)
    }
  };

  const removeBackground = async() => {
    if (!file) return;
    setLoading(true);
    let response

    const fd = new FormData()
    fd.append('image_file', file)


    console.log("fd", fd)
    const headers = {
      'x-api-key': API_KEY
    }

    response = await fetch(CLIP_API_REMOVE_BG, {
      method: 'POST',
      headers,
      body: fd,
    })

    await responseFormat(response);

  };

  const responseFormat = async(response) => {
    if (response.status && response.status > 400) {
      const text = await response.text()
      throw new Error(response.status + ' ' + text)
    }

    const blob = await response.blob()
    const base64 = await URL.createObjectURL(blob)
    setUploadFile(base64)
    setFile(blob);
    setLoading(false);
  }

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
          <Container>
            <Row>
              <Col xs={3} md={4}>
                <input style={{marginTop: '10px'}} type="file" onChange={handleFileChange} />
              </Col>
              <Col md={2}>
                <button onClick={() => removeBackground ()}><b>Remove BG</b> </button>
              </Col>
            </Row>
            <Row>
              <Col>
                { loading && <div style={{marginTop: '10px'}} className="loader"><b>Loading.........</b></div> }
              </Col>
            </Row>
          </Container>

                <div style={{ height: '70vh' }}>
                    <PinturaEditor
                        {...editorDefaults}
                        src={ template}
                        onLoad={(res) => console.log('load image', res)}
                        onProcess={({ dest }) => setResult(URL.createObjectURL(dest))}
                        onSelectutil={(details)=>console.log('details...',details)}
                        stickers={[
                          {
                            // src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Olive_wreath.svg/1259px-Olive_wreath.svg.png',
                            src: uploadFile,
                            width: 200,
                            height: 200,
                            alt: 'Number one',
                          }
                        ]}
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
