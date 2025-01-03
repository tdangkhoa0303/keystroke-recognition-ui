import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { SecurityLevel } from '@/models/user';
import { Label, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { useToggle } from 'usehooks-ts';

import { useAuth } from '@/auth';
import { SwitchField, ToggleGroupField } from '@/components/form';
import { OptionComponentProps } from '@/components/form/toggle-group-field';
import { Button } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { USER_PROFILE_QUERY_KEY } from '@/constants/query-keys';
import { useCustomMutation } from '@/hooks/api';
import apiClient from '@/lib/api-client';
import { TrainingHistory } from '@/models/history';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import PostSamples from './post-samples';
import { SECURITY_LEVEL_TEXTS } from '@/constants/texts';

const SECURITY_LEVEL_OPTIONS = [
  {
    text: SECURITY_LEVEL_TEXTS[SecurityLevel.LOW],
    value: SecurityLevel.LOW,
    subText: 'Suitable for casual use with minimal security checks.',
  },
  {
    text: SECURITY_LEVEL_TEXTS[SecurityLevel.MEDIUM],
    value: SecurityLevel.MEDIUM,
    subText:
      'Balanced security for most use cases, with moderate sensitivity to anomalies.',
  },
  {
    text: SECURITY_LEVEL_TEXTS[SecurityLevel.HIGH],
    value: SecurityLevel.HIGH,
    subText:
      'Strict security checks for critical systems, highly sensitive to behavioral deviations.',
  },
];

const chartConfig = {
  accuracy: {
    label: 'accuracy',
    color: 'hsl(var(--chart-1))',
  },
  february: {
    label: 'February',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const GET_LATEST_ESTIMATOR = 'settings/GET_LATEST_ESTIMATOR';

const SecurityLevelOption = ({ option, selected }: OptionComponentProps) => (
  <Card className="border-0 rounded-none shadow-none">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold">{option.text}</CardTitle>
    </CardHeader>
    {option.subText && (
      <CardContent className="text-sm text-muted-foreground">
        {option.subText}
      </CardContent>
    )}
  </Card>
);

const FORM_FIELDS = {
  SECURITY_LEVEL: 'security_level',
  ENABLE_BEHAVIOURAL_BIOMETRICS: 'enable_behavioural_biometrics',
} as const;

interface FormValues {
  [FORM_FIELDS.SECURITY_LEVEL]: SecurityLevel;
  [FORM_FIELDS.ENABLE_BEHAVIOURAL_BIOMETRICS]: boolean;
}

const KeystrokeDynamicSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: trainModel, isPending: isTraining } = useCustomMutation({
    mutationFn: () =>
      apiClient.post('/api/samples/train').then((response) => response.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GET_LATEST_ESTIMATOR] }),
    notify: {
      success: 'Training success!',
      error: 'Failed to train, please try again later!',
    },
  });

  const { data: latestEstimator = null, isFetched: isFetchedLatestEstimator } =
    useQuery({
      queryKey: [GET_LATEST_ESTIMATOR],
      queryFn: () =>
        apiClient
          .get<TrainingHistory>('/api/users/estimators/latest')
          .then((res) => res.data),
    });

  const latestTrainingAccuracy = (latestEstimator?.accuracy ?? 0) * 100;

  const {
    mutate: updateSecurityConfigs,
    isPending: isUpdatingSecurityConfigs,
  } = useCustomMutation({
    mutationFn: (data: FormValues) =>
      apiClient
        .post('/api/users/security', data)
        .then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY] });
    },
    notify: {
      success: 'Update security configs success!',
      error: 'Failed to update security configs, please try again later!',
    },
  });

  const form = useForm({
    defaultValues: {
      [FORM_FIELDS.ENABLE_BEHAVIOURAL_BIOMETRICS]:
        !!user?.enableBehaviouralBiometrics,
      [FORM_FIELDS.SECURITY_LEVEL]: user?.securityLevel ?? SecurityLevel.MEDIUM,
    },
  });
  const { handleSubmit, watch } = form;

  const enableBehavioralBiometrics = watch(
    FORM_FIELDS.ENABLE_BEHAVIOURAL_BIOMETRICS
  );

  const [isOpenPostSamplesDialog, , setIsOpenPostSamplesDialog] =
    useToggle(false);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit((values) => updateSecurityConfigs(values))}>
        <div className="flex items-center space-x-2 justify-between">
          <SwitchField
            label="Enable keystroke dynamics"
            name={FORM_FIELDS.ENABLE_BEHAVIOURAL_BIOMETRICS}
          />
          <Button type="submit">
            {isUpdatingSecurityConfigs && (
              <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
        {enableBehavioralBiometrics && (
          <>
            {!isFetchedLatestEstimator && (
              <div className="w-screen h-screen flex items-center justify-center">
                <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
              </div>
            )}
            {latestEstimator && (
              <div className="mt-4">
                <h4 className="font-medium my-4 text-lg">Current Model</h4>
                <div className="flex gap-8">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-full max-w-[240px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={[
                          {
                            name: 'Accuracy',
                            percent: latestTrainingAccuracy,
                            fill: 'var(--color-accuracy)',
                          },
                          {
                            name: 'other',
                            percent: 100 - latestTrainingAccuracy,
                            fill: 'var(--color-february)',
                          },
                        ]}
                        nameKey="name"
                        dataKey="percent"
                        innerRadius={60}
                        strokeWidth={5}
                        activeIndex={0}
                        activeShape={({
                          outerRadius = 0,
                          ...props
                        }: PieSectorDataItem) => (
                          <g>
                            <Sector {...props} outerRadius={outerRadius + 10} />
                            <Sector
                              {...props}
                              outerRadius={outerRadius + 25}
                              innerRadius={outerRadius + 12}
                            />
                          </g>
                        )}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) - 16}
                                    className="fill-muted-foreground text-md"
                                  >
                                    Accuracy
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 16}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {latestTrainingAccuracy.toFixed(2)}%
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-4 auto-rows-max">
                    <span className="font-medium text-md">Trained at:</span>
                    <span>
                      {format(latestEstimator?.created_at, 'dd MMM yyyy hh:mm')}
                    </span>
                    <span className="font-medium text-md">
                      Number of samples:
                    </span>
                    <span>{latestEstimator?.num_of_samples}</span>
                    <Button onClick={() => trainModel()} type="button">
                      {isTraining && (
                        <Icons.spinner className="mr-1 h-4 w-4 animate-spin" />
                      )}
                      Retrain
                    </Button>
                    <Dialog
                      open={isOpenPostSamplesDialog}
                      onOpenChange={setIsOpenPostSamplesDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">Update Samples</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[640px]">
                        <DialogHeader>
                          <DialogTitle>Update keystroke samples</DialogTitle>
                          <DialogDescription>
                            Let us know more about your typing style...
                          </DialogDescription>
                        </DialogHeader>
                        <PostSamples
                          retrainModel={trainModel}
                          onClose={() => setIsOpenPostSamplesDialog(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            )}
            <div className="my-4">
              <div className="flex gap-4">
                <ToggleGroupField
                  name={FORM_FIELDS.SECURITY_LEVEL}
                  label="Keystroke Security Level"
                  description="Please select the appropriate security level for your keystroke dynamics."
                  inputProps={{
                    type: 'single',
                    options: SECURITY_LEVEL_OPTIONS,
                    OptionComponent: SecurityLevelOption,
                    className: 'gap-4 items-stretch',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </form>
    </Form>
  );
};

export default KeystrokeDynamicSettings;
