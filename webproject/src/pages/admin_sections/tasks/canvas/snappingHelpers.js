import { Line } from "fabric";
import React from 'react';

const snappingDistance = 10;

export const handleObjectMoving = (canvas,obj, guidelines, setGuideLines) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    const left = obj.left;
    const top = obj.top;
    const right = left + obj.width * obj.scaleX;
    const bottom = top + obj.height * obj.scaleY;

    const centerX = (left + right)/2;
    const centerY = (top+bottom)/2;

    let newGuidelines = [];

    clearGuidelines(canvas);

    let snapped=false;
    if (Math.abs(left)<snappingDistance){
        obj.set({left:0});
        if (!guidelineExists(canvas, "vertical-left")){
            const line = createVerticalGuideline(canvas, 0, "vertical-left");
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped=true;
    }

    if (Math.abs(top)<snappingDistance){
        obj.set({top:0});
        if (!guidelineExists(canvas, "horizontal-top")){
            const line = createHorizontalGuideline(canvas, 0, "horizontal-top");
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped=true;
    }

    if (Math.abs(right-canvasWidth)<snappingDistance){
        obj.set({left:canvasWidth - obj.width*obj.scaleX});
        if (!guidelineExists(canvas, "vertical-right")){
            const line = createVerticalGuideline(canvas, canvasWidth, "vertical-right");
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped=true;
    }

    if (Math.abs(bottom-canvasHeight)<snappingDistance){
        obj.set({top:canvasHeight - obj.height*obj.scaleY});
        if (!guidelineExists(canvas, "horizontal-bottom")){
            const line = createVerticalGuideline(canvas, canvasHeight, "horizontal-bottom");
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped=true;
    }

    if (Math.abs(centerX - canvasCenterX) < snappingDistance) {
        obj.set({ left: canvasCenterX - obj.width*obj.scaleX / 2 });
        if (!guidelineExists(canvas, "vertical-center")) {
            const line = createVerticalGuideline(canvas, canvasCenterX, "vertical-center");
            newGuidelines.push(line);
            canvas.add(line);
        }
        snapped = true;
    }

    if (Math.abs(centerY - canvasCenterY) < snappingDistance) {
        obj.set({ top: canvasCenterY - obj.height * obj.scaleY / 2 });
        if (!guidelineExists(canvas, "horizontal-center")) {
            const line = createHorizontalGuideline(canvas, canvasCenterY, "horizontal-center");
            newGuidelines.push(line);
            canvas.add(line);
        }
    
        snapped = true;
    }

    console.log(snapped, newGuidelines, canvasCenterY, canvasCenterX, centerX, centerY, obj);
    if (!snapped){
        clearGuidelines(canvas);
    }else{
        newGuidelines.forEach(line => canvas.add(line));
        setGuideLines(newGuidelines);
    }

}

export const clearGuidelines = (canvas) => {
    const objects = canvas.getObjects("line");
    objects.forEach(obj => {
        if (obj.id && (obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-"))){
            canvas.remove(obj);
        }
    });
    canvas.renderAll();
}

export const createVerticalGuideline = (canvas, x, id) => {
    return new Line([x,0,x, canvas.height], {
        id, 
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5,5],
        opacity: 0.8
    });
}   

export const createHorizontalGuideline = (canvas, y, id) => {
    return new Line([0,y,canvas.width,y], {
        id,
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5,5],
        opacity: 0.8
    });
}

const guidelineExists = (canvas, id) => {
    const objects = canvas.getObjects("line");
    return objects.some(obj=>obj.id==id);
}