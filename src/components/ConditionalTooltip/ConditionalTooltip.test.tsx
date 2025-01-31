import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConditionalTooltip from './ConditionalTooltip';

const text = 'Hello';
const content = <h1>{text}</h1>;

it('Render content when show is true', () => {
  const { queryByText } = render(
    <div>
      <ConditionalTooltip content={content} show={true}>
        <>Test</>
      </ConditionalTooltip>
    </div>,
  );

  const divElement = queryByText('Test');
  expect(divElement).toBeInTheDocument();

  if (divElement) {
    waitFor(() => {
      userEvent.hover(divElement);
    });
  }

  waitFor(() => {
    expect(queryByText(text)).toBeInTheDocument();
  });
});

it('Hide content when show is false', () => {
  const { queryByText } = render(
    <div>
      <ConditionalTooltip content={content} show={false}>
        <div>Test</div>
      </ConditionalTooltip>
    </div>,
  );

  const divElement = queryByText('Test');
  expect(divElement).toBeInTheDocument();

  if (divElement) {
    waitFor(() => {
      userEvent.hover(divElement);
    });
  }

  waitFor(() => {
    expect(queryByText(text)).not.toBeInTheDocument();
  });
});
