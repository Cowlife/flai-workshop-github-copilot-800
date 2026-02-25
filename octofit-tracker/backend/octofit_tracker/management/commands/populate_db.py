from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users...')
        users = [
            # Team Marvel
            User(username='spider_man', email='peter.parker@marvel.com', password='webslinger123'),
            User(username='iron_man', email='tony.stark@marvel.com', password='iamironman'),
            User(username='black_widow', email='natasha.romanoff@marvel.com', password='widow123'),
            User(username='thor', email='thor.odinson@marvel.com', password='mjolnir'),
            User(username='captain_america', email='steve.rogers@marvel.com', password='shield123'),
            # Team DC
            User(username='batman', email='bruce.wayne@dc.com', password='darknight'),
            User(username='superman', email='clark.kent@dc.com', password='krypton'),
            User(username='wonder_woman', email='diana.prince@dc.com', password='lasso123'),
            User(username='the_flash', email='barry.allen@dc.com', password='speedforce'),
            User(username='aquaman', email='arthur.curry@dc.com', password='atlantis'),
        ]
        for user in users:
            user.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        # Fetch saved users to get valid IDs
        marvel_members = list(
            User.objects.filter(email__contains='@marvel.com').values_list('username', flat=True)
        )
        dc_members = list(
            User.objects.filter(email__contains='@dc.com').values_list('username', flat=True)
        )

        self.stdout.write('Creating teams...')
        Team(name='Team Marvel', members=marvel_members).save()
        Team(name='Team DC', members=dc_members).save()
        self.stdout.write(self.style.SUCCESS('Created 2 teams'))

        self.stdout.write('Creating activities...')
        activities = [
            Activity(user='spider_man', activity_type='Web Swinging', duration=45.0, date=date(2024, 1, 10)),
            Activity(user='iron_man', activity_type='Flight Training', duration=60.0, date=date(2024, 1, 11)),
            Activity(user='black_widow', activity_type='Combat Training', duration=90.0, date=date(2024, 1, 12)),
            Activity(user='thor', activity_type='Hammer Toss', duration=30.0, date=date(2024, 1, 13)),
            Activity(user='captain_america', activity_type='Shield Sparring', duration=75.0, date=date(2024, 1, 14)),
            Activity(user='batman', activity_type='Cape Gliding', duration=50.0, date=date(2024, 1, 10)),
            Activity(user='superman', activity_type='Super Flight', duration=120.0, date=date(2024, 1, 11)),
            Activity(user='wonder_woman', activity_type='Lasso Training', duration=80.0, date=date(2024, 1, 12)),
            Activity(user='the_flash', activity_type='Speed Run', duration=15.0, date=date(2024, 1, 13)),
            Activity(user='aquaman', activity_type='Deep Sea Swim', duration=100.0, date=date(2024, 1, 14)),
        ]
        for activity in activities:
            activity.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities)} activities'))

        self.stdout.write('Creating leaderboard entries...')
        leaderboard = [
            Leaderboard(user='spider_man', score=4500.0),
            Leaderboard(user='iron_man', score=6000.0),
            Leaderboard(user='black_widow', score=9000.0),
            Leaderboard(user='thor', score=3000.0),
            Leaderboard(user='captain_america', score=7500.0),
            Leaderboard(user='batman', score=5000.0),
            Leaderboard(user='superman', score=12000.0),
            Leaderboard(user='wonder_woman', score=8000.0),
            Leaderboard(user='the_flash', score=1500.0),
            Leaderboard(user='aquaman', score=10000.0),
        ]
        for entry in leaderboard:
            entry.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard)} leaderboard entries'))

        self.stdout.write('Creating workouts...')
        workouts = [
            Workout(name='Hero Cardio Blast', description='High intensity cardio inspired by superhero training regimes.', duration=45.0),
            Workout(name='Strength of Steel', description='Lift heavy to build the strength of Superman.', duration=60.0),
            Workout(name='Agility of Spider-Man', description='Flexibility and agility workout inspired by Spider-Man.', duration=30.0),
            Workout(name='Dark Knight HIIT', description='Intense interval training as trained by Batman himself.', duration=50.0),
            Workout(name='Speed Force Sprint', description='Speed drills inspired by The Flash.', duration=20.0),
        ]
        for workout in workouts:
            workout.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workouts'))

        self.stdout.write(self.style.SUCCESS('Database population complete!'))
