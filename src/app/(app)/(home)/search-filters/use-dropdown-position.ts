import { RefObject } from "react";



export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>) => {

    const getDropdownPosition = () => {

        if (!ref.current) return { left: 0, top: 0 }

        const rect = ref.current.getBoundingClientRect()
        const dropdownWidth = 240; // drodown width  (w-60 = 15rem = 240px)

        //calculate initial position
        let left = rect.left + window.scrollX
        let top = rect.top + rect.height + window.scrollY;

        // check if dropdown would go of the right edge of the viewport
        if (left + dropdownWidth > window.innerWidth) {
            left = rect.right + window.scrollX - dropdownWidth

            // if still offscreen, align to the right edge of viewport with some padding
            if (left < 0) {
                left = window.innerWidth - dropdownWidth - 16;
            }
        }

        // ensure dropdown doesn't go off left edge
        if (left < 16) {
            left = 0
        }

        return { top, left }
    }

    return getDropdownPosition
}