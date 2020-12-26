import { CanvasRenderService } from 'chartjs-node-canvas';

const pointsCanvasRender = new CanvasRenderService(900, 600);

export async function renderPointsCanvas(configuration: any) { return pointsCanvasRender.renderToBuffer(configuration) }

