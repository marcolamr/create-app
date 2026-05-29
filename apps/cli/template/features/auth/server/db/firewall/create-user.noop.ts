/** No-op when auth events / firewall SQL are not enabled. */
export async function assertCreateUserAllowed(_clientIp: string): Promise<void> {}

export async function assignDefaultFeaturesToNewUser(_userId: string): Promise<void> {}
