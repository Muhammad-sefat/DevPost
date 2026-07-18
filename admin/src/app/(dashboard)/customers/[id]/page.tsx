import { UserDetailContainer } from "@/features/customers"

interface PageProps {
  params: {
    id: string
  }
}

export default function CustomerDetailPage({ params }: PageProps) {
  return <UserDetailContainer id={params.id} />
}
