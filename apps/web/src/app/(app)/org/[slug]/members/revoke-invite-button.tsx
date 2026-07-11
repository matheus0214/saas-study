import { XOctagon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { removeInviteAction } from './actions'

type RevokeInviteButtonProps = {
  inviteId: string
}

export function RevokeInviteButton({
  inviteId,
}: Readonly<RevokeInviteButtonProps>) {
  return (
    <form action={removeInviteAction.bind(null, inviteId)}>
      <Button size="sm" variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Revoke
      </Button>
    </form>
  )
}
