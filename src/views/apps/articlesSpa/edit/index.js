// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button, Card, CardBody } from 'reactstrap'
// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { X, Coffee, Edit } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'

const ToastContent = ({ article }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Article '{article}' has been successfully updated !</span>
    </div>
  </>
)

const ArticleEdit = () => {

  const { id } = useParams()
  const history = useHistory()

  const [article, setArticle] = useState({})
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [options, setOptions] = useState([])

  // ** Function to get category on mount
  useEffect(() => {
    axiosInstance
      .get(`/articles/${id}`)
      .then(response => {
        setArticle(response.data)
        setOptions(response.data.options)

        const user = JSON.parse(localStorage.getItem('userData'))

        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }

        // fetch categories
        axiosInstance
          .get(`/spa_categories?hotel_id=${user.hotel_id}&web=5`)
          .then(res => {
            setCategories(res.data)
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => console.log(err))
  }, [])

  const addOption = () => {
    if (article.max_options > options.length) {
      const id = (Math.floor(Math.random() * Date.now())).toString()
      setOptions([...options, { id, name: '', max_choice: 0, choices: [] }])
    }
  }

  const addChoice = (opt) => {
    const newOptions = options.map(option => {
      if (opt.id === option.id && opt.choices.length < opt.max_choice) {
        const id = (Math.floor(Math.random() * Date.now())).toString()
        option.choices = [...option.choices, { id, name: '' }]
      }

      return option
    })

    setOptions(newOptions)
  }

  const setOptionName = (id, value) => {
    const newOptions = options.map(option => {
      if (id === option.id) {
        option.name = value
      }

      return option
    })

    setOptions(newOptions)
  }

  const setOptionMaxChoices = (id, value) => {
    const newOptions = options.map(option => {
      if (id === option.id) {
        option.max_choice = value
      }

      return option
    })

    setOptions(newOptions)
  }

  const setChoiceName = (option, id, value) => {
    const choices = option.choices.map(choice => {
      if (id === choice.id) {
        choice.name = value
      }

      return choice
    })

    const newOptions = options.map(opt => {
      if (opt.id === option.id) {
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

  const maxOptionsChange = (e) => {
    setArticle({ ...article, max_options: parseInt(e.target.value)})
  }

  const handleFormSubmit = () => {
    const formData = new FormData()
    formData.append("_method", 'PUT')

    if (article.id) formData.append('id', article.id)
    if (article.name) formData.append('name', article.name)
    if (article.description) formData.append('description', article.description)
    if (article.image) formData.append('image', article.image)
    if (article.price) formData.append('price', article.price)
    if (article.cost) formData.append('cost', article.cost)
    if (article.category_id) formData.append('category_id', article.category_id)
    if (article.max_options) formData.append('max_options', article.max_options)
    if (options?.length) {
      for (let i = 0; i < options.length; i++) {
        formData.append(`options[${i}][id]`, options[i].id)
        formData.append(`options[${i}][name]`, options[i].name)
        formData.append(`options[${i}][max_choice]`, options[i].max_choice)
        for (let j = 0; j < options[i].choices.length; j++) {
          formData.append(`options[${i}][choices][${j}][id]`, options[i].choices[j].id)
          formData.append(`options[${i}][choices][${j}][name]`, options[i].choices[j].name)
        }
      }
    }
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    axiosInstance.post(`/articles/${id}`, formData, {config}).then(res => {
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
  
  const customInputStyle = {
    position: "absolute",
    left: "0px",
    top: "25px"
  }
  const customLabelStyle = {
    marginBottom : "20px",
    fontSize: "15px",
    fontWeight: "600"
  }

  return (
    <Card>
      <CardBody>
      <div className='app-user-list'>
        <h1>Edit article</h1>
        {/* Article Infos */}
        <Row>
          <Col sm='4'>
            <Label for="name">Name</Label>
            <Input
              invalid={errors?.name !== undefined}
              type="text"
              id="name"
              placeholder='Enter article name'
              required
              value={article?.name || ''}
              onChange={(e) => setArticle({ ...article, name: e.target.value })}
            />
            {errors?.name && <FormFeedback>{errors?.name[0]}</FormFeedback>}
          </Col>
          <Col sm='4'>
            <Label for="category_id">Category</Label>
            <Input
              invalid={errors.category_id !== undefined}
              type="select"
              id="category_id"
              value={article.category_id}
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
          <Col sm='4'>
            <Label for="max_options">Max options</Label>
            <Input
              invalid={errors?.max_options !== undefined}
              type="number"
              id="max_options"
              placeholder='Enter max options'
              required
              value={article?.max_options || ''}
              onChange={maxOptionsChange}
            />
            {errors?.max_options && <FormFeedback>{errors?.max_options[0]}</FormFeedback>}
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm='4'>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                invalid={errors?.price !== undefined}
                type="number"
                id="price"
                placeholder="Enter the article price"
                value={article?.price || ''}
                onChange={(e) => setArticle({ ...article, price: e.target.value })}
              />
              {errors?.price && <FormFeedback>{errors?.price[0]}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col sm='4'>
            <FormGroup>
              <Label for="cost">Cost</Label>
              <Input
                invalid={errors?.cost !== undefined}
                type="number"
                id="cost"
                placeholder="Enter the article cost"
                value={article?.cost || ''}
                onChange={(e) => setArticle({ ...article, cost: e.target.value })}
              />
              {errors?.cost && <FormFeedback>{errors?.cost[0]}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col sm='4'>
            <Label style={customLabelStyle} for="image">Image</Label>
            <FormGroup>
                <img src={`${article.image}`} width="100px" />
                <Label style={customInputStyle} for="image" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input 
                  invalid={errors.image !== undefined}
                  type="file" 
                  id="image"
                  name="image"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setArticle({ ...article, image: e.target.files[0] })}
                   />
                   {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
              </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm='12'>
            <Label for="description">Description</Label>
            <Input
              invalid={errors?.description !== undefined}
              type="textarea"
              id="description"
              placeholder='Enter article description'
              required
              value={article?.description || ''}
              onChange={(e) => setArticle({ ...article, description: e.target.value })}
            />
            {errors?.description && <FormFeedback>{errors?.description[0]}</FormFeedback>}
          </Col>
        </Row>
        <br />
        {/* Article Options */}
        {article.max_options > 0 &&
          <h3>Options</h3>
        }
        {
          options?.map((option, option_index) => {
            return (
              <div key={option.id} style={{ border: '1px solid black', padding: '1rem', marginTop: '1rem' }}>
                <Row>
                  <Col sm={5}>
                    <Label for={option.id}>Name</Label>
                    <Input
                      invalid={errors?.name !== undefined}
                      type="text"
                      id={option.id}
                      placeholder='Enter option name'
                      value={option.name || ''}
                      onChange={(e) => setOptionName(option.id, e.target.value)}
                    />
                    {/* {errors?.name && <FormFeedback>{errors?.name[0]}</FormFeedback>} */}
                  </Col>
                  <Col sm={5}>
                    <Label for="max_choice">Max Choices</Label>
                    <Input
                      invalid={errors?.name !== undefined}
                      type="number"
                      id="max_choice"
                      placeholder='Enter max Choices'
                      value={option.max_choice || ''}
                      onChange={(e) => setOptionMaxChoices(option.id, e.target.value)}
                    />
                    {/* {errors?.name && <FormFeedback>{errors?.name[0]}</FormFeedback>} */}
                  </Col>
                  <Col sm={1}>
                    <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteOption(option_index)} outline>
                      <X size={14} className='mr-50' />
                      <span>Delete</span>
                    </Button.Ripple>              
                  </Col>
                </Row>
                <br />
                {option.max_choice > 0 &&
                  <h3>Choices</h3>
                }
                {
                  option.choices.map((choice, choice_index) => {
                    return (
                      <div key={choice.id}>
                        <FormGroup row>
                          <Label for={choice.id} sm={1}>Name</Label>
                          <Col sm={4}>
                            <Input
                              invalid={errors?.name !== undefined}
                              type="text"
                              id={choice.id}
                              placeholder="Enter choice name"
                              value={choice.name || ''}
                              onChange={(e) => setChoiceName(option, choice.id, e.target.value)}
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
                  {option.max_choice > option.choices.length &&
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
          {article.max_options > options.length && 
            <Col sm='12' className='pt-1 d-flex justify-content-end align-items-end'>
              <Button color='success' onClick={addOption}>Add Option</Button>
            </Col>
          }
        </Row>
        <br />
        {/* Button Submit */}
        <Row>
          <Col sm='12' className='d-flex justify-content-center align-items-end'>
            <Button color='primary' onClick={handleFormSubmit}>Update Article</Button>
          </Col>
        </Row>
      </div>
      </CardBody>
    </Card>
  )
}

export default ArticleEdit