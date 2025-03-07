import { useAuth } from '@/auth';
import Logo from '@/components/logo';
import VerificationForm from '@/components/pages/auth/keystroke-verification-form';
import SignInForm from '@/components/pages/auth/sign-in-form';
import { useCustomMutation } from '@/hooks/api';
import apiClient from '@/lib/api-client';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { z } from 'zod';

const fallback = '/' as const;

export const Route = createFileRoute('/__auth/sign-in')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: SignIn,
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
});

function SignIn() {
  const { login, logout, sessionData } = useAuth();
  const navigate = useNavigate();
  const verificationFormRef = useRef<{ reset: () => void } | null>(null);

  const { mutate: signIn, isPending: isSigningIn } = useCustomMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient
        .post('/api/users/sign-in', data)
        .then((response) => response.data)
        .then(
          (responseData: {
            id: string;
            accessToken: string;
            refreshToken: string;
            requiredKeystrokeVerification: boolean;
          }) => {
            const {
              id,
              accessToken,
              refreshToken,
              requiredKeystrokeVerification,
            } = responseData;
            apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            const sessionData = {
              sessionId: id,
              accessToken,
              refreshToken,
              pending: requiredKeystrokeVerification,
            };
            login(sessionData);
          }
        ),
    notify: {
      success: 'Sign in successfully!',
      error: 'Sign in failed!',
    },
  });

  const { mutate: verifyKeystroke, isPending: isVerifyingKeystroke } =
    useCustomMutation({
      mutationFn: (data: Record<string, unknown>) =>
        apiClient.post('/api/users/verify-session', data),
      notify: {
        success: 'Verification successfully!',
        error: 'Verification failed!',
      },
      onSuccess: () => {
        if (sessionData) {
          login({
            ...sessionData,
            pending: false,
          });
          navigate({ to: '/' });
        }
      },
      onSettled: () => {
        verificationFormRef.current?.reset();
      },
    });

  const shouldShowVerificationForm = sessionData?.pending;

  return (
    <div
      style={{
        backgroundImage: 'url(/decorator-1.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <div className="m-auto grid grid-cols-2 h-screen max-w-screen-2xl">
        <div className="relative flex flex-col justify-center max-w-[800px] p-8">
          <div className="relative z-20 flex items-center text-xl font-medium mb-10">
            <Logo className="w-20 h-20 mr-4" />
            <div className="text-white">
              <p className="text-4xl mb-2 tracking-widest">KDR</p>
              <p>Keystroke Dynamics Recognition</p>
            </div>
          </div>
          <p className="text-xl leading-relaxed text-white">
            <strong>Unlock a new era of security.</strong> Gone are the days of
            forgotten passwords and vulnerable accounts. Your typing style is
            the key to a seamless and personalized login experience. Step into
            the future of authentication.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-8 justify-center items-center">
          <div className="max-w-[600px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${!!shouldShowVerificationForm}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                {shouldShowVerificationForm ? (
                  <VerificationForm
                    ref={verificationFormRef}
                    onSubmit={verifyKeystroke}
                    loading={isVerifyingKeystroke}
                    onSignInWithAnotherAccount={logout}
                  />
                ) : (
                  <SignInForm onSubmit={signIn} loading={isSigningIn} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
