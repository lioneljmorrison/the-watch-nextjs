import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DisplayMeter from './DisplayMeter';

const meta = {
  component: DisplayMeter,
  title: 'DisplayMeter',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    deviceName: 'Produce Fridge 1',
    batteryLevel: 75,
    tempLevel: 21.6,
    humidityLevel: 55,
    isCelsius: true,
    hasSignal: true,
    dateTime: new Date('2023-08-01T12:00:00'),
    tempTrend: 'neutral',
  },
} satisfies Meta<typeof DisplayMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LowBattery: Story = {
  args: {
    batteryLevel: 20,
  },
};

export const OkayBattery: Story = {
  args: {
    batteryLevel: 45,
  },
};

export const NoSignal: Story = {
  args: {
    hasSignal: false,
  },
};

export const IsFahrenheit: Story = {
  args: {
    isCelsius: false,
  },
};

export const TempRising: Story = {
  args: {
    tempTrend: 'rising',
  },
};

export const TempFalling: Story = {
  args: {
    tempTrend: 'falling',
  },
};
