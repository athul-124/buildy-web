import { AdminSchedulerForm } from '@/components/AdminSchedulerForm';

export const metadata = {
  title: "AI Contractor Scheduler | Thrissur Home Joy Admin",
};

export default function AdminSchedulerPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Contractor Scheduling</h1>
            <p className="text-muted-foreground">
                Utilize our intelligent scheduling tool to efficiently book contractors.
            </p>
        </div>
        <AdminSchedulerForm />
    </div>
  );
}
