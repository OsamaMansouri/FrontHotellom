// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import React, { useState, useEffect, Fragment } from 'react'
import { X, Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback, Card, CardBody } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { isBase64, image64toCanvasRef  } from '../../utils/checkImage'

const ToastContent = ({ article }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Article '{article}' has been successfully added !</span>
        </div>
    </>
)

const ArticleAdd = () => {
    // ** State
    const [article, setArticle] = useState({})
    const [categories, setCategories] = useState([])
    const [ShopType, SetShopType] = useState([])
    const [shop_id, Setshop_id] = useState()
    const [options, setOptions] = useState([])
    const [errors, setErrors] = useState({})
    const history = useHistory()
    const [imgSrc, setImgSrc] = useState(null)
    const [imgSrcFinal, setImgSrcFinal] = useState(null)
    const [crop, setCrop] = useState({
                                aspect: 1 / 1,
                                width: 200,
                                height: 200,
                                unit: 'px'
                            })
    const imagePreviewCanvasRef = React.createRef()

    const imageMaxSize = 10000000 // bytes
    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
 
    //** ComponentDidMount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData) {
          axiosInstance
            .get(`/spa_categories?hotel_id=${userData.hotel_id}&web=5`)
            .then(res => { 
                setCategories(res.data)
              console.log(res.data)
            })
            .catch(err => { console.log(err) })
        }
      }, [])

    const handleshoptype = (e) => {
        const getshopid = e.target.value
        console.log(getshopid)
        Setshop_id(getshopid)
    }

    const verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert(`This file is not allowed. ${currentFileSize} bytes is too large`)
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert(`This file is not allowed. ${currentFileType} Only images are allowed.`)
                return false
            }
            return true
        }
    }

    const handleOnImageLoaded = (image) => {}

    const handleOnDrop = (acceptedFiles, rejectedFiles) => {

        if (rejectedFiles && rejectedFiles.length > 0) {
            verifyFile(rejectedFiles)
        }

        if (acceptedFiles && acceptedFiles.length > 0) {
            
            const isVerified = verifyFile(acceptedFiles)
            if (isVerified) {
                const currentFile = acceptedFiles[0]
                const reader = new FileReader()
                reader.onload = r => {
                    //console.log(r.target.result)
                    setImgSrc(r.target.result)
                    
                }
                reader.readAsDataURL(acceptedFiles[0])
                  
            }
        }
    }

    const handleOnCropChange = crop => { 
        setCrop(crop)
    }

    const handleOnCropComplet = (crop) => {

        const canvasRef = imagePreviewCanvasRef.current
        const img = new Image()
        img.src = canvasRef.toDataURL()
        image64toCanvasRef(canvasRef, imgSrc, crop)
        setImgSrcFinal(img.src)
    }

    const addOption = () => {
        if (article.maxOptions > options.length) {
            const uid = (Math.floor(Math.random() * Date.now())).toString()
            setOptions([...options, { uid, name: '', maxChoices: 0, choices: [] }])
        }
    }

    const addChoice = (opt) => {
        const newOptions = options.map(option => {
            if (opt.uid === option.uid && opt.choices.length < opt.maxChoices) {
                const uid = (Math.floor(Math.random() * Date.now())).toString()
                option.choices = [...option.choices, { uid, name: '' }]
            }

            return option
        })

        setOptions(newOptions)
    }

    const setOptionName = (uid, value) => {
        const newOptions = options.map(option => {
            if (uid === option.uid) {
                option.name = value
            }

            return option
        })

        setOptions(newOptions)
    }

    const setOptionMaxChoices = (uid, value) => {
        const newOptions = options.map(option => {
            if (uid === option.uid) {
                option.maxChoices = value
            }

            return option
        })

        setOptions(newOptions)
    }

    const setChoiceName = (option, uid, value) => {
        const choices = option.choices.map(choice => {
            if (uid === choice.uid) {
                choice.name = value
            }

            return choice
        })

        const newOptions = options.map(opt => {
            if (opt.uid === option.uid) {
                opt.choices = choices
            }

            return opt
        })
        
        setOptions(newOptions)
    }

    const deleteOption = (option_index) => {
        options.splice(option_index, 1)

        setOptions([...options])
    }

    const deleteChoice = (option_index, choice_index) => {
        options[option_index].choices.splice(choice_index, 1)

        setOptions([...options])
    }

    const handleFormSubmit = () => {
        const formData = new FormData()
        if (imgSrcFinal !== null) {
            if (isBase64(imgSrcFinal)) {
                formData.append('image', imgSrcFinal)
            } else {
                formData.append('image', imgSrc)
            }
        }
        if (article.name) formData.append('name', article.name)
        if (article.description) formData.append('description', article.description)
        /* if (article.image) formData.append('image', article.image) */
        if (article.price) formData.append('price', article.price)
        if (article.cost) formData.append('cost', article.cost)
        if (article.category_id && article.category_id !== '0') formData.append('category_id', article.category_id)
        if (article.maxOptions) formData.append('max_options', article.maxOptions)
        if (options.length) {
            for (let i = 0; i < options.length; i++) {
                formData.append(`options[${i}][name]`, options[i].name)
                formData.append(`options[${i}][max_choice]`, options[i].maxChoices)
                for (let j = 0; j < options[i].choices.length; j++) {
                    formData.append(`options[${i}][choices][${j}][name]`, options[i].choices[j].name)
                }
            }
        }

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axiosInstance.post('/articles', formData, config).then(res => {
            toast.success(
                <ToastContent article={article.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/articlesSpa/list')
        }).catch(err => {
            console.log(err.response.data.errors)
            setErrors(err.response.data.errors)
        })
    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new article</h1>
                    {/* Article Infos */}
                    <Row>
                        <Col sm="8">
                            <Row>
                                <Col sm='12'>
                                    <Label for="name">Name</Label>
                                    <Input
                                        invalid={errors.name !== undefined}
                                        type="text"
                                        id="name"
                                        placeholder='Enter article name'
                                        required
                                        onChange={(e) => setArticle({ ...article, name: e.target.value })}
                                    />
                                    {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col sm='6'>
                                    <FormGroup>
                                        <Label for="price">Price</Label>
                                        <Input
                                            invalid={errors.price !== undefined}
                                            type="number"
                                            id="price"
                                            placeholder="Enter the article price"
                                            onChange={(e) => setArticle({ ...article, price: e.target.value })}
                                        />
                                        {errors.price && <FormFeedback>{errors.price[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col sm='6'>
                                    <FormGroup>
                                        <Label for="cost">Cost</Label>
                                        <Input
                                            invalid={errors.cost !== undefined}
                                            type="number"
                                            id="cost"
                                            placeholder="Enter the article cost"
                                            onChange={(e) => setArticle({ ...article, cost: e.target.value })}
                                        />
                                        {errors.cost && <FormFeedback>{errors.cost[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                {/* <Col sm='6'>
                                    <FormGroup>
                                        <Label for="image">Image</Label>
                                        <CustomInput
                                            invalid={errors.image !== undefined}
                                            type="file"
                                            id="image"
                                            onChange={(e) => setArticle({ ...article, image: e.target.files[0] })}
                                        />
                                        {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col> */}
                            </Row>
                            <br/>
                            <Row>
                                <Col sm='12'>
                                    <Label for="description">Description</Label>
                                    <Input
                                        invalid={errors.description !== undefined}
                                        type="textarea"
                                        id="description"
                                        placeholder='Enter article description'
                                        
                                        onChange={(e) => setArticle({ ...article, description: e.target.value })}
                                    />
                                    {errors.description && <FormFeedback>{errors.description[0]}</FormFeedback>}
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                {/* <Col sm='6'>
                                    <Label for="category_id">Shop Type</Label>
                                    <Input
                                        invalid={errors.category_id !== undefined}
                                        type="select"
                                        id="category_id"
                                        defaultValue="0"
                                        required
                                        onChange={handleshoptype}
                                    >
                                        <option value='0' disabled>Select Category</option>
                                        {
                                            // ShopType.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)
                                        }
                                    </Input>
                                    {errors.category_id && <FormFeedback> {errors.category_id[0]} </FormFeedback>}
                                </Col> */}
                                <Col sm='6'>
                                    <Label for="category_id">Category</Label>
                                    <Input
                                        invalid={errors.category_id !== undefined}
                                        type="select"
                                        id="category_id"
                                        defaultValue="0"
                                        required
                                        onChange={(e) => setArticle({ ...article, category_id: parseInt(e.target.value) })}
                                    >
                                        <option value='0' disabled>Select Category</option>
                                        {
                                            categories.map(categorie => <option key={categorie.id} value={categorie.id}>{categorie.name}</option>)
                                        }
                                    </Input>
                                    {errors.category_id && <FormFeedback> {errors.category_id[0]} </FormFeedback>}
                                </Col>
                                <Col sm='6'>
                                    <Label for="maxOptions">Max options</Label>
                                    <Input
                                        invalid={errors.max_options !== undefined}
                                        type="number"
                                        id="maxOptions"
                                        placeholder='Enter max options'
                                        onChange={(e) => setArticle({ ...article, maxOptions: parseInt(e.target.value) })}
                                    />
                                    {errors.max_options && <FormFeedback>{errors.max_options[0]}</FormFeedback>}
                                </Col>
                            </Row>
                            <br/>
                            {/* Article Options */}
                            {article.maxOptions > 0 &&
                                <h3>Options</h3>
                            }
                            {
                                options.map((option, option_index) => {
                                    return (
                                        <div key={option.uid} style={{ border: '1px solid black', padding: '1rem', marginTop: '1rem' }}>
                                            <Row>
                                                <Col sm={5}>
                                                    <Label for={option.uid}>Name</Label>
                                                    <Input
                                                        invalid={errors.name !== undefined}
                                                        type="text"
                                                        id={option.uid}
                                                        placeholder='Enter option name'
                                                        onChange={(e) => setOptionName(option.uid, e.target.value)}
                                                    />
                                                    {/* {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>} */}
                                                </Col>
                                                <Col sm={5}>
                                                    <Label for="maxChoices">Max Choices</Label>
                                                    <Input
                                                        invalid={errors.name !== undefined}
                                                        type="number"
                                                        id="maxChoices"
                                                        placeholder='Enter max Choices'
                                                        onChange={(e) => setOptionMaxChoices(option.uid, e.target.value)}
                                                    />
                                                    {/* {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>} */}
                                                </Col>
                                                <Col sm={1}>
                                                    <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteOption(option_index)} outline>
                                                        <X size={14} className='mr-50' />
                                                        <span>Delete</span>
                                                    </Button.Ripple>              
                                                </Col>
                                            </Row>
                                            <br/>
                                            {option.maxChoices > 0 &&
                                                <h3>Choices</h3>
                                            }
                                            {
                                                option.choices.map((choice, choice_index) => {
                                                    return (
                                                        <div key={choice.uid}>
                                                            <FormGroup row>
                                                                <Label for={choice.uid} sm={1}>Name</Label>
                                                                <Col sm={4}>
                                                                    <Input
                                                                        invalid={errors.name !== undefined}
                                                                        type="text"
                                                                        id={choice.uid}
                                                                        placeholder="Enter choice name"
                                                                        onChange={(e) => setChoiceName(option, choice.uid, e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={1}>
                                                                    <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteChoice(option_index, choice_index)} outline>
                                                                        <X size={14} className='mr-50' />
                                                                        <span>Delete</span>
                                                                    </Button.Ripple>              
                                                                </Col>
                                                            </FormGroup>
                                                        </div>
                                                    )
                                                })
                                            }

                                            <Row>
                                                {option.maxChoices > option.choices.length &&
                                                    <Col sm='12' className='pt-1 d-flex justify-content-end align-items-end'>
                                                        <Button color='dark' onClick={() => addChoice(option)}>Add Choice</Button>
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
                                    )
                                })
                            }
                            <Row>
                                {article.maxOptions > options.length && 
                                    <Col sm='12' className='pt-1 d-flex justify-content-end align-items-end'>
                                        <Button color='success' onClick={addOption}>Add Option</Button>
                                    </Col>
                                }
                            </Row>
                            <br />
                            {/* Button Submit */}
                            <Row>
                                <Col sm='12' className='d-flex justify-content-center align-items-end'>
                                    <Button color='primary' onClick={handleFormSubmit}>Create Article</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="4">
                            <Card className='card-statistics' /* style={ { height: 220 } } */>
                                <CardBody className='statistics-body d-flex align-item-end'>
                                    <Row className="d-flex align-item-end" style={{borderStyle: "dashed", padding: "15px", height:"400px", borderColor:"background: linear-gradient(118deg, #36013f, rgba(54, 1, 63, 0.7))"}} >
                                        {/* <input accept="image/*" type='file' id="imgInp" /> */}
                                        <Dropzone 
                                        onDrop={handleOnDrop} multiple={false} maxSize={imageMaxSize} accept={acceptedFileTypes}>
                                            {({getRootProps, getInputProps}) => (
                                                <section>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <p>Drag 'n' drop some files here, or click to select files    {/* <em>(Only *.jpeg and *.png images will be accepted)</em> */}</p>
                                                </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                        <br/>
                                        { imgSrc !== null ? <div>
                                                <ReactCrop 
                                                    src={imgSrc} 
                                                    crop={crop} 
                                                    onChange={handleOnCropChange} 
                                                    onComplete={handleOnCropComplet}
                                                    onImageLoaded={handleOnImageLoaded}
                                                />
                                                {/* <br/>
                                                <p>Preview Canvas Crop </p> */}
                                                {<canvas style={{display:"none"}} ref={imagePreviewCanvasRef} ></canvas>}
                                                {/* <img src="" id="blah" style={ { height: 250 } } alt="Preview Of Downloaded Image" /> */}
                                            </div> : ''
                                        }
                                        {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    
                </div>
            </CardBody>
        </Card>
    )
}

export default ArticleAdd