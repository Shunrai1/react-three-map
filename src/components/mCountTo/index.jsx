import React, { useState, useEffect, useRef } from 'react';
import { requestAnimationFrame, cancelAnimationFrame } from './requestAnimationFrame.js'
const CountTo = ({
    startVal = 0,
    endVal = 2017,
    duration = 3000,
    autoplay = true,
    decimals = 0,
    decimal = '.',
    separator = ',',
    prefix = '',
    suffix = '',
    useEasing = true,
    easingFn = (t, b, c, d) => (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b,
    onMountedCallback,
    onCallback,
}) => {
    const formatNumber = (num) => {
        let formattedNum = num.toFixed(decimals);
        formattedNum += '';
        const parts = formattedNum.split('.');
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? decimal + parts[1] : '';

        if (separator && isNaN(parseFloat(separator))) {
            const rgx = /(\d+)(\d{3})/;
            while (rgx.test(integerPart)) {
                integerPart = integerPart.replace(rgx, '$1' + separator + '$2');
            }
        }

        return prefix + integerPart + decimalPart + suffix;
    };
    const [displayValue, setDisplayValue] = useState(formatNumber(startVal));
    const [printVal, setPrintVal] = useState(null);
    const [paused, setPaused] = useState(false);
    const [localStartVal, setLocalStartVal] = useState(startVal);
    const [localDuration, setLocalDuration] = useState(duration);

    const startTimeRef = useRef(null);
    const timestampRef = useRef(null);
    const remainingRef = useRef(null);
    const rAFRef = useRef(null);
    const isMountedRef = useRef(false);

    const countDown = startVal > endVal;



    const count = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        timestampRef.current = timestamp;
        const progress = timestamp - startTimeRef.current;
        remainingRef.current = localDuration - progress;

        let currentPrintVal;

        if (useEasing) {
            if (countDown) {
                currentPrintVal = localStartVal - easingFn(progress, 0, localStartVal - endVal, localDuration);
            } else {
                currentPrintVal = easingFn(progress, localStartVal, endVal - localStartVal, localDuration);
            }
        } else {
            if (countDown) {
                currentPrintVal = localStartVal - (localStartVal - endVal) * (progress / localDuration);
            } else {
                currentPrintVal = localStartVal + (endVal - localStartVal) * (progress / localDuration);
            }
        }

        // Clamp the value
        if (countDown) {
            currentPrintVal = currentPrintVal < endVal ? endVal : currentPrintVal;
        } else {
            currentPrintVal = currentPrintVal > endVal ? endVal : currentPrintVal;
        }

        setPrintVal(currentPrintVal);
        setDisplayValue(formatNumber(currentPrintVal));

        if (progress < localDuration) {
            rAFRef.current = requestAnimationFrame(count);
        } else if (onCallback) {
            onCallback();
        }
    };

    const start = () => {
        setLocalStartVal(startVal);
        startTimeRef.current = null;
        setLocalDuration(duration);
        setPaused(false);
        cancelAnimationFrame(rAFRef.current);
        rAFRef.current = requestAnimationFrame(count);
    };

    const pauseResume = () => {
        if (paused) {
            resume();
            setPaused(false);
        } else {
            pause();
            setPaused(true);
        }
    };

    const pause = () => {
        cancelAnimationFrame(rAFRef.current);
    };

    const resume = () => {
        startTimeRef.current = null;
        setLocalDuration(remainingRef.current || duration);
        setLocalStartVal(printVal || startVal);
        rAFRef.current = requestAnimationFrame(count);
    };

    const reset = () => {
        startTimeRef.current = null;
        cancelAnimationFrame(rAFRef.current);
        setDisplayValue(formatNumber(startVal));
    };

    useEffect(() => {
        isMountedRef.current = true;
        if (autoplay) {
            start();
        }
        if (onMountedCallback) {
            onMountedCallback();
        }

        return () => {
            isMountedRef.current = false;
            cancelAnimationFrame(rAFRef.current);
        };
    }, []);

    useEffect(() => {
        if (autoplay) {
            start();
        }
    }, [startVal, endVal]);

    return <span>{displayValue}</span>;
};

export default CountTo;