import { Link } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import BrandLogo from '../../components/logo/brandLogo'

const ForgotPasswordV1 = () => {
  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <BrandLogo />
            <CardTitle tag='h4' className='mb-1'>
              Forgot Password? 🔒
            </CardTitle>
            <CardText className='mb-2'>
              Enter your email and we'll send you instructions to reset your password
            </CardText>
            <Form className='auth-forgot-password-form mt-2' onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input type='email' id='login-email' placeholder='john@example.com' autoFocus />
              </FormGroup>
              <Button.Ripple color='primary' block>
                Send reset link
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/pages/login-v1'>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPasswordV1
