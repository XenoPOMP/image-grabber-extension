import { FC } from 'react';

import { PropsWith } from '@type/PropsWith';

import type { PortalProps } from './Portal.props';

/**
 * Portal component. Render or not render child.
 *
 * @param children
 * @param {boolean} enabled       defines whether Portal is enabled.
 * @constructor
 */
const Portal: FC<PropsWith<'children', PortalProps>> = ({
  children,
  enabled
}) => {
  return enabled ? <>{children}</> : <></>;
};

export default Portal;
