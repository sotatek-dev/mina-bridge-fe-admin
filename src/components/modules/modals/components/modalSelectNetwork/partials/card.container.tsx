'use client';

import { useMemo } from 'react';

import Card from '../partials/card';

import { NETWORK_NAME } from '@/models/network';

const networkOrder = [NETWORK_NAME.MINA, NETWORK_NAME.ETHEREUM];

export default function CardContainer() {
  return useMemo(
    () => networkOrder.map((key) => <Card key={key} nwKey={key} />),
    []
  );
}
