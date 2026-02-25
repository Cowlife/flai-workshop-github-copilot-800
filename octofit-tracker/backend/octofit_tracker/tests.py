from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='spider_man',
            email='peter.parker@marvel.com',
            password='webslinger123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'spider_man')
        self.assertEqual(self.user.email, 'peter.parker@marvel.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'spider_man')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['spider_man', 'iron_man', 'thor']
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')
        self.assertIn('spider_man', self.team.members)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='spider_man',
            activity_type='Web Swinging',
            duration=45.0,
            date=date(2024, 1, 10)
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, 'spider_man')
        self.assertEqual(self.activity.activity_type, 'Web Swinging')
        self.assertEqual(self.activity.duration, 45.0)

    def test_activity_str(self):
        self.assertEqual(str(self.activity), 'spider_man - Web Swinging')


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='iron_man',
            score=6000.0
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'iron_man')
        self.assertEqual(self.entry.score, 6000.0)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'iron_man: 6000.0')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Hero Cardio Blast',
            description='High intensity cardio inspired by superhero training.',
            duration=45.0
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Hero Cardio Blast')
        self.assertEqual(self.workout.duration, 45.0)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Hero Cardio Blast')


class APIEndpointTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            username='batman',
            email='bruce.wayne@dc.com',
            password='darknight'
        )
        self.team = Team.objects.create(
            name='Team DC',
            members=['batman', 'superman']
        )
        self.activity = Activity.objects.create(
            user='batman',
            activity_type='Cape Gliding',
            duration=50.0,
            date=date(2024, 1, 10)
        )
        self.leaderboard = Leaderboard.objects.create(
            user='batman',
            score=5000.0
        )
        self.workout = Workout.objects.create(
            name='Dark Knight HIIT',
            description='Intense interval training as trained by Batman.',
            duration=50.0
        )

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teams_list(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activities_list(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_list(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workouts_list(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
