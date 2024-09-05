import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Input,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui'
import { auth } from '../../firebaseConfig'
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { FirebaseError } from 'firebase/app'

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number is required')
    .regex(
      /^\+[1-9]\d{1,14}$/,
      'Phone number must be in E.164 format (e.g., +1234567890)',
    ),
})

const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .min(6, 'Your one-time password must be 6 characters.'),
})

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>
type VerificationCodeFormValues = z.infer<typeof verificationCodeSchema>

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [verificationId, setVerificationId] = React.useState<string | null>(
    null,
  )
  const [loading, setLoading] = React.useState(false)
  const recaptchaVerifierRef = React.useRef<RecaptchaVerifier | null>(null)

  const phoneNumberForm = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  const verificationCodeForm = useForm<VerificationCodeFormValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      verificationCode: '',
    },
  })

  React.useEffect(() => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: string) => {
            console.log('reCAPTCHA solved. Token:', response)
          },
        },
      )

      recaptchaVerifier.render().then((widgetId) => {
        console.log('reCAPTCHA rendered. Widget ID:', widgetId)
      })

      recaptchaVerifierRef.current = recaptchaVerifier
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error)
      toast({
        title: 'reCAPTCHA Error',
        description: 'Failed to initialize reCAPTCHA. Please refresh the page.',
        variant: 'destructive',
      })
    }
  }, [toast])

  const handleSendVerificationCode = async (data: PhoneNumberFormValues) => {
    setLoading(true)
    const { phoneNumber } = data
    try {
      const recaptchaVerifier = recaptchaVerifierRef.current
      if (recaptchaVerifier) {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier,
        )
        setVerificationId(confirmationResult.verificationId)
        toast({
          title: 'Success',
          description: 'Verification code sent successfully!',
        })
      }
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/invalid-phone-number'
      ) {
        console.error('Invalid phone number:', error)
        toast({
          title: 'Invalid phone number. Please try again.',
          description:
            'Phone number must be in E.164 format (e.g., +1234567890)',
          variant: 'destructive',
        })
      } else {
        console.error('Error sending verification code:', { error })
        toast({
          title:
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.',
          description: 'Please refresh the page and try again.',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: VerificationCodeFormValues) => {
    setLoading(true)
    const { verificationCode } = data
    if (verificationId) {
      try {
        const credential = PhoneAuthProvider.credential(
          verificationId,
          verificationCode,
        )
        await signInWithCredential(auth, credential)
        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        })
        navigate('/profile')
      } catch (error) {
        if (
          error instanceof FirebaseError &&
          error.code === 'auth/invalid-verification-code'
        ) {
          console.error('Error verifying code:', error)
          toast({
            title: 'Invalid verification code.',
            description: 'Please try again.',
            variant: 'destructive',
          })
        } else {
          console.error('Error sending verification code:', { error })
          toast({
            title: 'Failed to verify code. Please try again.',
            description:
              error instanceof Error
                ? error.message
                : 'Failed to verify code. Please try again.',
            variant: 'destructive',
          })
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {!verificationId && (
          <Form {...phoneNumberForm}>
            <form
              onSubmit={phoneNumberForm.handleSubmit(
                handleSendVerificationCode,
              )}
              className="space-y-8"
            >
              <FormField
                control={phoneNumberForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      By tapping Verify, an SMS may be sent. Message & data
                      rates may apply.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div id="recaptcha-container" />
              <Button type="submit" loading={loading}>
                Verify
              </Button>
            </form>
          </Form>
        )}
        {verificationId && (
          <Form {...verificationCodeForm}>
            <form
              onSubmit={verificationCodeForm.handleSubmit(handleVerifyCode)}
              className="space-y-8"
            >
              <FormField
                control={verificationCodeForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verify your phone number</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the 6-digit code we sent to your phone
                      number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" loading={loading}>
                Verify Code
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
