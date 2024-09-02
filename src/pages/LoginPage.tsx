import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import { auth } from "../../firebaseConfig";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number is required")
    // .regex(/^\d+$/, "Invalid phone number"),
});

const verificationCodeSchema = z.object({
  verificationCode: z.string().min(6, "Verification code is required"),
});

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;
type VerificationCodeFormValues = z.infer<typeof verificationCodeSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [verificationId, setVerificationId] = React.useState<string | null>(
    null
  );
  const recaptchaVerifierRef = React.useRef<RecaptchaVerifier | null>(null);

  const phoneNumberForm = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const verificationCodeForm = useForm<VerificationCodeFormValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  React.useEffect(() => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth, 'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: string) => {
            console.log('reCAPTCHA solved. Token:', response);
          },
        },
      );
      
      recaptchaVerifier.render().then((widgetId) => {
        console.log('reCAPTCHA rendered. Widget ID:', widgetId);
      });
  
      recaptchaVerifierRef.current = recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }
  }, []);

  const handleSendVerificationCode = async (data: PhoneNumberFormValues) => {
    const { phoneNumber } = data;
    console.log('Sending verification code to', phoneNumber);
    try {
      const recaptchaVerifier = recaptchaVerifierRef.current;
      if (recaptchaVerifier) {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setVerificationId(confirmationResult.verificationId);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleVerifyCode = async (data: VerificationCodeFormValues) => {
    const { verificationCode } = data;
    if (verificationId) {
      try {
        const credential = PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        await signInWithCredential(auth, credential);
        navigate('/profile');
      } catch (error) {
        console.error("Error verifying code:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {!verificationId && (
          <Form {...phoneNumberForm}>
            <form
              onSubmit={phoneNumberForm.handleSubmit(handleSendVerificationCode)}
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
                  </FormItem>
                )}
              />
              <div id="recaptcha-container" />
              <Button type="submit">Send Verification Code</Button>
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
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the verification code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Verify Code</Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
