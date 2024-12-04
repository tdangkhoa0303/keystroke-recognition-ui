import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useCustomMutation } from '@/hooks/api'
import apiClient from '@/lib/api-client'
import { generateKeystrokeSamples } from '@/lib/tracker'
import { KeystrokeEvent, Sample } from '@/models/sample'
import TextField from '@/components/form/text-field'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { useRef } from 'react'
import TrackedTextField from '@/components/form/tracked-text-field'
import { Form } from '@/components/ui/form'

export const Route = createFileRoute('/__auth/settings')({
  component: DashboardPage,
})

function DashboardPage() {
  const { mutate: postSamples, isPending: isPostingSamples } =
    useCustomMutation({
      mutationFn: (data: Sample[]) =>
        apiClient
          .post('/api/users/samples', { samples: data })
          .then((response) => response.data),
      onSuccess: () => form.reset(),
    })
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const keystrokeEventsRef = useRef<Record<string, KeystrokeEvent[]>>({})

  const { mutate: verifySamples } = useCustomMutation({
    mutationFn: (data: Sample[]) =>
      apiClient
        .post('/api/samples/verify', { samples: data })
        .then((response) => {
          const result = response.data as (0 | 1)[]

          form.reset()
          if (result.filter((i) => i === 1).length / result.length <= 0.6) {
            throw new Error()
          }
        }),

    notify: {
      success: 'Valid!',
      error: 'Not valid!',
    },
  })

  const { mutate: trainSamples, isPending: isTraining } = useCustomMutation({
    mutationFn: () =>
      apiClient.post('/api/samples/train').then((response) => response.data),
    onSuccess: () => {
      form.reset()
    },
  })

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-2">
        <Button onClick={() => trainSamples()}>
          {isTraining && (
            <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
          )}
          Train Samples
        </Button>
      </div>
      <Card>
        <Form {...form}>
          <form autoComplete="off">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                Let us know your styles...
              </CardTitle>
              <CardDescription>
                Enter any long text that you can think of
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <TrackedTextField
                name="password"
                label="When the dream come true, we go to bed"
                inputProps={{
                  placeholder: 'Enter your password...',
                  onKeystokeEventsChange: (events) => {
                    keystrokeEventsRef.current['password'] = events
                  },
                }}
              />
              <TrackedTextField
                name="confirmPassword"
                label="Confirm password"
                inputProps={{
                  placeholder: 'Confirm your password...',
                  onKeystokeEventsChange: (events) => {
                    keystrokeEventsRef.current['confirmPassword'] = events
                  },
                }}
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={form.handleSubmit(() =>
                  postSamples([
                    ...generateKeystrokeSamples({
                      events: keystrokeEventsRef.current['password'],
                    }),
                    ...generateKeystrokeSamples({
                      events: keystrokeEventsRef.current['confirmPassword'],
                    }),
                  ]),
                )}
              >
                {isPostingSamples && (
                  <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
                )}
                Post Samples
              </Button>
              <Button
                variant="outline"
                onClick={form.handleSubmit(() =>
                  verifySamples([
                    ...generateKeystrokeSamples({
                      events: keystrokeEventsRef.current['password'],
                    }),
                    ...generateKeystrokeSamples({
                      events: keystrokeEventsRef.current['confirmPassword'],
                    }),
                  ]),
                )}
              >
                Verify Samples
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  )
}
