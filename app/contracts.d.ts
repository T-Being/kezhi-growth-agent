export type ClientId = string;
export type Money = number; // 正式接口以分为单位；UI 适配层转换为元
export type MemoryStatus = 'confirmed' | 'pending' | 'expired' | 'disabled';
export type ExecutionStatus = 'running' | 'success' | 'partial' | 'failed' | 'unknown';
export interface Scope { clientId: ClientId; accountId: string; }
export interface Evidence { id: string; clientId: ClientId; kind: 'metric' | 'message' | 'review'; source: string; content: string; observedAt: string; metricDefinition?: string; }
export interface Memory { id: string; clientId: ClientId; kind: string; content: string; evidenceIds: string[]; status: MemoryStatus; validUntil: string; version: number; confirmedBy?: string; }
export interface Adjustment { objectId: string; field: 'dailyBudget'; before: Money; after: Money; }
export interface Strategy extends Scope { id: string; version: number; adjustments: Adjustment[]; evidenceIds: string[]; memoryVersions: {id:string;version:number}[]; observationDays: number; manualReviewThreshold: number; notes: string; }
export interface Validation { valid: boolean; issues: {code:string;message:string;field?:string}[]; checkedAt: string; }
export interface ExecutionPreview { previewId: string; strategy: Strategy; currentConfigVersion: string; validation: Validation; expiresAt: string; }
export interface ConfirmExecution extends Scope { previewId: string; strategyId: string; strategyVersion: number; idempotencyKey: string; }
export interface ExecutionItem extends Adjustment { status:'pending'|'success'|'failed'|'unknown'|'unchanged'; error?:ServiceError; }
export interface Execution extends Scope { id: string; strategyVersion:number; status: ExecutionStatus; items: ExecutionItem[]; submittedAt:string; finishedAt?:string; }
export interface ServiceError { code:'BUDGET_EXCEEDED'|'STALE_MEMORY'|'DATA_INCOMPLETE'|'CONFIG_CHANGED'|'PERMISSION_DENIED'|'EXECUTION_UNKNOWN'|'UNAVAILABLE'; message:string; retryable:boolean; requestId:string; }
export type Result<T> = {ok:true;data:T;requestId:string} | {ok:false;error:ServiceError};
export interface GrowthApi {
  getMemories(scope:Scope):Promise<Result<Memory[]>>;
  getEvidence(scope:Scope,id:string):Promise<Result<Evidence>>;
  diagnose(scope:Scope,taskId:string):Promise<Result<{id:string;facts:string[];hypotheses:string[];gaps:string[];evidenceIds:string[]}>>;
  generateStrategy(scope:Scope,diagnosisId:string):Promise<Result<Strategy[]>>;
  validateStrategy(strategy:Strategy):Promise<Result<Validation>>;
  previewExecution(strategy:Strategy):Promise<Result<ExecutionPreview>>;
  confirmExecution(input:ConfirmExecution):Promise<Result<Execution>>;
  getExecution(scope:Scope,executionId:string):Promise<Result<Execution>>;
}
