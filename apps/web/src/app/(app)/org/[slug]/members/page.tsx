import { ability } from '@/auth/auth'

import { Invites } from './invites'
import { MemberList } from './member-list'

export default async function Members() {
  const permissions = await ability()

  const canListInvites = permissions?.can('get', 'Invite')
  const canListUsers = permissions?.can('get', 'User')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="space-y-4">
        {canListInvites && <Invites />}
        {canListUsers && <MemberList />}
      </div>
    </div>
  )
}
