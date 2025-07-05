#!/bin/sh

export CI=true
npm run build
npm test -- ./test/suite.test.tsx