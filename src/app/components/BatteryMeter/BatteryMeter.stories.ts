import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BatteryMeter from './BatteryMeter';

const meta = {
  component: BatteryMeter,
  title: 'BatteryMeter',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
  },
} satisfies Meta<typeof BatteryMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    batteryLevel: 50
  },
};

export const Low: Story = {
  args: {
    batteryLevel: 20
  },
};

export const Full: Story = {
  args: {
    batteryLevel: 100
  },
};
