import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
const CLIP_API_REMOVE_BG = `https://sdk.photoroom.com/v1/segment`
// const CLIP_API_REPLACE_BG = `https://beta-sdk.photoroom.com/v1/instant-backgrounds`
const CLIP_API_REPLACE_BG = `https://beta-sdk.photoroom.com/v1/render`
const API_KEY = "27e9428e688f503335e699d229836d83e62f0e13"


function PhotoRoom() {

  const templates = [
    { name: 'Square, white background, 5% padding', image: 'template/square-white-background-5-padding.png', templateId: '9124f52a-3512-48b7-80f1-2cb07a3607fb'},
    { name: 'Square, black background, 5% padding', image: 'template/square-black-background-5-padding.png', templateId: '267f6020-2814-4c4f-83c5-9908e8f60d63'},
    { name: 'Shopify landscape, white background, 5% margin', image: 'template/shopify-landscape-white-background-5-margin.png', templateId: 'e31818d4-6d3d-4287-afa3-f26ff13363f7'},
    { name: 'Square, custom silk background, 5% padding', image: 'template/square-custom-silk-background-5-padding.png', templateId: 'a2d6eb02-65fa-4133-8c20-b5aaa880bd72'},
    { name: 'Square, white background, 5% padding, 3D shadow', image: 'template/square-white-background-5-padding-3d-shadow.png', templateId: '74a4fc24-ce32-4481-9cba-9a8f8d21fe43'},
    { name: 'Square, marble custom background, 5% padding', image: 'template/square-marble-custom-background-5-padding.png', templateId: '88a56429-6b29-4235-9778-54b971b189a0'},
  ];
  const [file, setFile] = useState('');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState();
  const [filePev, setFilePrv] = useState('')

  const [prompt, setPrompt] = useState('#009900')

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };


  const handleChange = (event) => {
    setPrompt(event.target.value)
  };

  const removeBackground = async() => {
    if (!file) return;
    setLoading(true);
    let response

    const fd = new FormData()
    fd.append('image_file', file)
    if (prompt) {
      fd.append('bg_color', prompt);
    }


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

  const replaceBackground = async() => {
    if (!file) return;

    let response
    setLoading(true);
    const fd = new FormData()
    console.log("template", template)
    console.log("imageFile", file)
    fd.append('templateId', template);
    fd.append('imageFile', file)

    const headers = {
      'x-api-key': API_KEY
    }
    
    response = await fetch(CLIP_API_REPLACE_BG, {
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
    setFilePrv(base64);
    setFile(blob);
    setLoading(false);
  }

  const handleChangeTemplate = (templateId) => {
    setTemplate(templateId)
  }

  return (
    <div>


      <Container>
        <Row>
          <Col xs={3} md={4}>
            <input style={{marginTop: '10px'}} type="file" onChange={handleFileChange} />
          </Col>
          <Col>
            <input style={{marginTop: '10px'}} type="color" value={prompt} id="color" name="prompt" onChange={handleChange}/>
          </Col>
        </Row>
        <Row>

          {templates.map((item) =>
            <Col key={item.templateId} md={3}>
              <Image src={item.image} rounded onClick={(event) => handleChangeTemplate(item.templateId)} />
              <p>{ item.name }</p>
            </Col>
          )}


        </Row>
      </Container>

      <Container>
        <Row>
          <Col md={2}>
            <button onClick={() => removeBackground ()}><b>Remove BG</b> </button>
          </Col>
          <Col md={2}>
            <button onClick={() => replaceBackground ()}><b>Replace BG </b></button>
          </Col>
        </Row>
        <Row>
          <Col>
            { loading && <div style={{marginTop: '10px'}} className="loader"><b>Loading.........</b></div> }
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="mt-5">
          <div  style={{marginTop: '10'}}>
            {filePev &&
              <img
                alt="upload preview"
                className="object-cover object-center rounded-md"
                src={filePev}
              />
            }
          </div>
        </Row>
      </Container>

    </div>
  );
}

export default PhotoRoom;