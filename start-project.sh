cd frontend
echo "Starting frontend server..."
npm install
npm run dev &

cd ../backend
echo "Starting backend server..."
npm install
npm run start:dev &

wait