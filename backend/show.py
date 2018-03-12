import cv2 , numpy as np

cap = cv2.VideoCapture(0)

while(1):
	_, frame =  cap.read()
	hsvImage = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)

	lower_blue = np.array([0,50,50])
	upper_blue = np.array([30,255,255])
	lower_green = np.array([40,50,50])
	upper_green = np.array([60,255,255])
	mask1 = cv2.inRange(hsvImage, lower_blue, upper_blue)
	mask2 = cv2.inRange(hsvImage, lower_green, upper_green)
	mask = mask1 + mask2
	res = cv2.bitwise_and(frame, frame, mask = mask)
	#cv2.imshow('frame', frame)
	#cv2.imshow('mask', mask)
	cv2.imshow('res', res)
	k = cv2.waitKey(5) & 0xFF
	if k == 27:
		break
