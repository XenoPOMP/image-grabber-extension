import { describe, expect, test } from 'vitest';

import Button from '@ui/Button/Button';

import renderWithProviders from '@utils/renderWithProviders';

import { defaultTestingPageRender } from './defaults';

describe('Button component', () => {
  test('Match snapshot', () => {
    expect(
      renderWithProviders(
        <>
          <Button
            className={'px-1.5 py-0.5'}
            style={{
              color: 'red'
            }}
            onClick={() => console.log('Clicked')}
          >
            Click me
          </Button>

          <Button onClick={() => console.log('Clicked')} variant={'cancel'}>
            Click me
          </Button>
        </>
      )
    ).toMatchSnapshot();
  });
});
