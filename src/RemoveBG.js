import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
const CLIP_API_REMOVE_BG = `https://api.remove.bg/v1.0/removebg`
const CLIP_API_REPLACE_BG = `https://beta-sdk.photoroom.com/v1/render`
const API_KEY = "nYuups3V3UhMDmgSTBR69cjL"


function RemoveBG() {

  const [file, setFile] = useState('');
  const [repFle, setRepFle] = useState('');
  const [loading, setLoading] = useState();
  const [filePev, setFilePrv] = useState('')

  const [prompt, setPrompt] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileChangeForReplace = (e) => {
    if (e.target.files) {
      setRepFle(e.target.files[0]);
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
    if (repFle) {
      fd.append('bg_image_file', repFle);
    }
    // fd.append('roi', '10% 10% 100% 100%');
    fd.append('scale', '30%');
    fd.append('position', '50%,10%');


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
    setFilePrv(base64);
    setFile(blob);
    setLoading(false);
  }


  return (
    <div>


      <Container>
        <Row>
          <Col xs={3} md={4}>
            <input style={{marginTop: '10px'}} type="file" onChange={handleFileChange} />
          </Col>
          <Col xs={3} md={4}>
            <input style={{marginTop: '10px'}} type="file" onChange={handleFileChangeForReplace} />
          </Col>
          <Col>
            <input style={{marginTop: '10px'}} type="color" value={prompt} id="color" name="prompt" onChange={handleChange}/>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col md={2}>
            <button onClick={() => removeBackground ()}><b>Remove BG</b> </button>
          </Col>
          <Col md={2}>
            <button onClick={() => removeBackground ()}><b>Replace BG </b></button>
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
                className=""
                src={filePev}
              />
            }
          </div>
        </Row>
      </Container>

    </div>
  );
}

export default RemoveBG;