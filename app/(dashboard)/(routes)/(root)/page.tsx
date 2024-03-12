
import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { CoursesList } from '@/components/courses-list';
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { CheckSquare2Icon, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { InfoCard } from './_components/InfoCard';


export default async function Home() {
  const {userId}= auth();
  if(!userId) {
   return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);

  return (
    <div className='p-6 space-y-4'>
       <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InfoCard variant="default" icon={Clock} label="In progress" numerOfItems={coursesInProgress.length}/>

          <InfoCard variant="success" icon={CheckSquare2Icon} label="Completed" numerOfItems={completedCourses.length}/>
       </div>

       <CoursesList items={[...coursesInProgress,...completedCourses]} /> 
       {/* los 3 puntos son para desestructurar el array */}
    </div>
    
  )
}
