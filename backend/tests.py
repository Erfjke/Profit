@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

def test_update_transport(transport, route):
    new_data = {
        'route_id': route.id,
        'costs': 150.00,
        'transport_date': date.today(),
        'departure_time': time(9, 0),
        'arrival_time': time(13, 0),
        'fare': 55.00
    }
    updated_transport = update_transport(transport.id, new_data)
    assert updated_transport.costs == 150.00
    assert updated_transport.departure_time == time(9, 0)
    assert updated_transport.fare == 55.00

@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

def test_update_route(route):
    new_data = {
        'start_location': 'Гродно',
        'end_location': 'Гомель',
        'passenger_flow': 120
    }
    updated_route = update_route(route.id, new_data)
    assert updated_route.start_location == 'Гродно'
    assert updated_route.end_location == 'Гомель'
    assert updated_route.passenger_flow == 120


@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

@pytest.fixture
def forecast(transport, db):
    return Forecast.objects.create(
        transport=transport,
        predicted_revenue=5000.00,
        predicted_passenger_flow=100,
        predicted_profitability=50.00
    )

def test_update_forecast(forecast):
    new_data = {
        'predicted_revenue': 5500.00,
        'predicted_passenger_flow': 120,
        'predicted_profitability': 55.00
    }
    updated_forecast = update_forecast(forecast.id, new_data)
    assert updated_forecast.predicted_revenue == 5500.00
    assert updated_forecast.predicted_passenger_flow == 120
    assert updated_forecast.predicted_profitability == 55.00

@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

@pytest.fixture
def forecast(transport, db):
    return Forecast.objects.create(
        transport=transport,
        predicted_revenue=5000.00,
        predicted_passenger_flow=100,
        predicted_profitability=50.00
    )

def test_search_data(route, transport, forecast):
    results = search_data("Минск")
    assert route in results["routes"]
    assert transport in results["transports"]
    assert forecast in results["forecasts"]

@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

def test_predict_profitability(transport):
    profitability = predict_profitability(transport.id)
    assert profitability == 4900.0



@pytest.fixture
def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

@pytest.fixture
def client():
    return Client()

def test_generate_report(client, transport):
    response = client.get(reverse('generate-report', args=[transport.id]))
    assert response.status_code == 200
    assert response['Content-Type'] == 'application/pdf'
    assert 'attachment; filename=report_' in response['Content-Disposition']


def route(db):
    return Route.objects.create(start_location="Минск", end_location="Брест", passenger_flow=100)

@pytest.fixture
def transport(route, db):
    return Transport.objects.create(
        route=route,
        costs=100.00,
        transport_date=date.today(),
        departure_time=time(8, 0),
        arrival_time=time(12, 0),
        fare=50.00
    )

def test_get_analytics_data(transport):
    analytics_data = get_analytics_data()
    assert analytics_data['total_costs'] == 100.00
    assert analytics_data['total_revenue'] == 5000.00

@pytest.fixture
def user(db):
    return User.objects.create(username='testuser', first_name='Test', last_name='User', email='testuser@example.com')

def test_update_user_data(user):
    new_data = {'first_name': 'Updated', 'last_name': 'User', 'email': 'updateduser@example.com'}
    updated_user = update_user_data(user.id, new_data)
    assert updated_user.first_name == 'Updated'
    assert updated_user.last_name == 'User'
    assert updated_user.email == 'updateduser@example.com'

