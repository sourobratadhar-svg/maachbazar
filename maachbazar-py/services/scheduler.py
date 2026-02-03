import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.template_sender import broadcast_morning_template
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Starts the scheduler to run jobs.
    """
    # Schedule morning broadcast at 8:00 AM IST (Asia/Kolkata)
    # Note: Server time zone might matter. CronTrigger allows specifying timezone.
    
    # Assuming the server is in UTC or we want to be explicit:
    # 8 AM IST = 2:30 AM UTC
    # Or just use timezone='Asia/Kolkata' if available and pytz installed.
    # Let's try to just use server local time if we can't be sure, 
    # but safe bet is explicit CRON.
    
    # Trigger at 8:00 AM every day
    trigger = CronTrigger(hour=8, minute=0, timezone='Asia/Kolkata')
    
    scheduler.add_job(
        broadcast_morning_template,
        trigger=trigger,
        id="morning_broadcast",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Scheduler started. Morning broadcast set for 8:00 AM IST.")
